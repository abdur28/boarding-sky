import { HotelOffer, ProviderTokens, SearchHotelOffersParams } from "@/types";
import { create } from "zustand";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Add provider configuration type
interface ProviderConfig {
  requiresAuth: boolean;
  baseUrl?: string;
}

const PROVIDER_CONFIG: Record<string, ProviderConfig> = {
  'serp': {
    requiresAuth: false
  },
  'amadeus': {
    requiresAuth: true,
    baseUrl: '/api/amadeus'
  }
  // Add other providers as needed
};

export interface HotelSearchParams {
  city: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  rooms: number;
  priceRange?: {
    min?: number;
    max?: number;
  };
  amenities?: string[];
  ratings?: string[];
  boardType?: string;
  paymentPolicy?: string;
  hotelClass?: number[];
  providerIds?: string[];
}

interface HotelState {
  hotelOffers: HotelOffer[];
  filteredHotels: HotelOffer[];
  tokens: ProviderTokens;
  isLoading: boolean;
  error: string | null;

  getProviderToken: (providerId: string) => Promise<string | null>;
  searchHotelOffers: (params: HotelSearchParams) => Promise<void>;
  setFilteredHotels: (hotels: HotelOffer[]) => void;
}

export const useHotel = create<HotelState>((set, get) => ({
  hotelOffers: [],
  filteredHotels: [],
  tokens: {},
  isLoading: false,
  error: null,

  getProviderToken: async (providerId: string) => {
    const providerConfig = PROVIDER_CONFIG[providerId];
    
    // If provider doesn't require auth, return null
    if (!providerConfig?.requiresAuth) {
      return null;
    }

    set({ isLoading: true, error: null });
    const tokens = get().tokens;
    const currentToken = tokens[providerId];

    // Check if token exists and is not expired (with 5-minute buffer)
    if (currentToken && Date.now() < currentToken.expiresAt - 300000) {
      return currentToken.token;
    }

    // Token doesn't exist or is expired, get a new one
    try {
      const response = await fetch(`/api/${providerId}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch token for ${providerId}. Status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.data?.access_token) {
        throw new Error(`Invalid token response from ${providerId}`);
      }

      const newToken = {
        token: data.data.access_token,
        expiresAt: Date.now() + data.data.expires_in * 1000,
      };

      set(state => ({
        tokens: {
          ...state.tokens,
          [providerId]: newToken,
        },
        isLoading: false,
      }));

      return newToken.token;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to get token for ${providerId}`;
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  searchHotelOffers: async (params: HotelSearchParams) => {
    set({ isLoading: true, error: null });

    try {
      const { getProviderToken } = get();

      if (!params.providerIds || params.providerIds.length === 0) {
        throw new Error('No providers selected');
      }

      // Handle providers based on their authentication requirements
      const providerRequests = params.providerIds.map(async (providerId) => {
        try {
          const providerConfig = PROVIDER_CONFIG[providerId];
          if (!providerConfig) {
            throw new Error(`Unknown provider: ${providerId}`);
          }

          let token = null;
          if (providerConfig.requiresAuth) {
            token = await getProviderToken(providerId);
            set({ isLoading: true, error: null });
            if (!token) {
              throw new Error(`Failed to get token for ${providerId}`);
            }
          }

          const response = await fetch(`/api/${providerId}/hotel-offers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(token ? { ...params, token } : params),
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch hotels from ${providerId}`);
          }

          const data = await response.json();
          return data.data || [];
        } catch (error) {
          console.error(`Error fetching from ${providerId}:`, error);
          return [];
        }
      });

      // Wait for all provider requests to complete
      const responses = await Promise.all(providerRequests);
      const allHotels = responses.flat();

      if (allHotels.length === 0) {
        throw new Error('No hotels found from any provider');
      }

      // Sort hotels by price
      const sortedHotels = allHotels.sort((a, b) => 
        (typeof a.price === 'number' ? a.price : a.price.current) -
        (typeof b.price === 'number' ? b.price : b.price.current)
      );

      set({
        hotelOffers: sortedHotels,
        filteredHotels: sortedHotels,
        isLoading: false,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch hotels';
      set({
        error: errorMessage,
        isLoading: false,
        hotelOffers: [],
        filteredHotels: [],
      });
    }
  },


    searchHotelOffer: async (propertyId: string, params: SearchHotelOffersParams) => {
        set({ isLoading: true, error: null });

        try {
            const response = await fetch(`/api/serp/hotel-offers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    propertyId,
                    ...params
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch hotel offer');
            }

            const data = await response.json();
            
            if (!data.success || !data.data?.[0]) {
                throw new Error('No hotel data found');
            }

            const hotelOffer = data.data[0];

            set({
                hotelOffers: [hotelOffer],
                filteredHotels: [hotelOffer],
                isLoading: false,
            });

            return hotelOffer;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch hotel offer';
            set({
                error: errorMessage,
                isLoading: false,
                hotelOffers: [],
                filteredHotels: [],
            });
            throw error;
        }
    },

  setFilteredHotels: (hotels) => set({ filteredHotels: hotels }),
}));