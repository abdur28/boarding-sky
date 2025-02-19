import { HotelOffer } from "@/types";
import { create } from "zustand";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  ratings?: string[];
  paymentPolicy?: string;
  amenities?: string[];
  hotelClass?: number[];
  provider?: string;
  providers?: string[];
}

interface HotelState {
  hotelOffers: HotelOffer[];
  filteredHotels: HotelOffer[];
  isLoading: boolean;
  error: string | null;
  hotelOffer: HotelOffer | null;

  searchHotelOffers: (params: HotelSearchParams) => Promise<void>;
  searchHotelOffer: (propertyId: string, params: Partial<HotelSearchParams>) => Promise<any>;
  getHotelOffer: (params: Partial<HotelSearchParams>) => Promise<any>;
  applyFilters: (filters: Partial<HotelSearchParams>) => void;
  setFilteredHotels: (hotels: HotelOffer[]) => void;
}

export const useHotel = create<HotelState>((set, get) => ({
  hotelOffers: [],
  hotelOffer: null,
  filteredHotels: [],
  isLoading: false,
  error: null,

  searchHotelOffers: async (params: HotelSearchParams) => {
    set({ isLoading: true, error: null });

    try {
      const providers = params.providers;

      if (!providers || providers.length === 0) {
        throw new Error('No Provider to fetch Data');
      }

      const offers: HotelOffer[] = [];

      for (const provider of providers) {
        try {
          let response;
          if (provider === 'direct') {
            response = await fetch('/api/actions/get-hotel-offers', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                city: params.city,
                checkIn: params.checkIn,
                checkOut: params.checkOut,
                adults: params.adults,
                children: params.children,
                rooms: params.rooms,
                priceRange: params.priceRange,
                amenities: params.amenities,
                hotelClass: params.hotelClass,
              }),
            });
          } else {
            response = await fetch(`/api/${provider}/hotel-offers`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(params),
            });
          }

          if (!response.ok) {
            throw new Error(`Failed to fetch hotel offers from ${provider}`);
          }

          const data = await response.json();

          if (!data.data) {
            throw new Error(data.error || `Failed to fetch hotel offers from ${provider}`);
          }

          // Add provider information to each offer
          const providerOffers = data.data.map((offer: HotelOffer) => ({
            ...offer,
            provider
          }));

          offers.push(...providerOffers);
        } catch (error) {
          console.error(`Error fetching from ${provider}:`, error);
          continue;
        }
      }

      if (offers.length === 0) {
        throw new Error('No hotel offers found from any provider');
      }

      // Sort hotels by price
      const sortedHotels = offers.sort((a, b) => 
        a.price.current - b.price.current
      );

      set({
        hotelOffers: sortedHotels,
        filteredHotels: sortedHotels,
        isLoading: false,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch hotel offers';
      set({
        error: errorMessage,
        isLoading: false,
        hotelOffers: [],
        filteredHotels: [],
      });
    }
  },

  getHotelOffer: async (params: Partial<HotelSearchParams>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/actions/get-hotel-offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      const data = await response.json();
      if (data.data) {
        set({ isLoading: false, hotelOffer: data.data });
        return data.data;
      } else {
        set({ isLoading: false, hotelOffer: null });
        throw new Error(data.error || 'Failed to fetch hotel offer');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch hotel offer';
      set({
        error: errorMessage,
        isLoading: false,
        hotelOffer: null
      });
      throw error;
    }
  },

  searchHotelOffer: async (propertyId: string, params: Partial<HotelSearchParams>) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/actions/get-hotel-offer', {
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
      
      if (!data.data) {
        throw new Error('No hotel data found');
      }

      set({
        hotelOffers: [data.data],
        filteredHotels: [data.data],
        isLoading: false,
      });

      return data.data;
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

  applyFilters: (filters: Partial<HotelSearchParams>) => {
    const { hotelOffers } = get();
    let filtered = [...hotelOffers];

    // Price range filter
    if (filters.priceRange) {
      const min = filters.priceRange.min || 0;
      const max = filters.priceRange.max || Infinity;
      filtered = filtered.filter(hotel => {
        const price = hotel.price.current;
        return price >= min && price <= max;
      });
    }

    // Amenities filter
    if (filters.amenities?.length) {
      filtered = filtered.filter(hotel => 
        filters.amenities?.every(amenity => 
          hotel.amenities.includes(amenity)
        )
      );
    }

    // Star rating filter
    if (filters.ratings?.length ) {
      filtered = filtered.filter(hotel => 
        filters.ratings?.includes(hotel.hotelClass!.toString())
      );
    }

    // Payment policy filter
    if (filters.paymentPolicy) {
      filtered = filtered.filter(hotel => {
        switch (filters.paymentPolicy) {
          case 'GUARANTEE':
            return hotel.paymentOptions?.prePayment;
          case 'DEPOSIT':
            return hotel.paymentOptions?.depositRequired;
          case 'NONE':
            return hotel.paymentOptions?.payAtProperty;
          default:
            return true;
        }
      });
    }

    set({ filteredHotels: filtered });
},

  setFilteredHotels: (hotels) => set({ filteredHotels: hotels }),
}));