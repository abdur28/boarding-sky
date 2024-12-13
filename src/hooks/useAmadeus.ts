import { create } from "zustand";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ErrorState {
  message: string;
  code?: string;
  status?: number;
}

type AmadeusState = {
  token: string;
  isLoading: boolean;
  error: ErrorState | null;
  tokenExpires: number;
  airports: Array<any>;
  flightsOffers: any;
  hotelsId: Array<any>;
  hotelRating: Array<any>;
  hotelOffers: Array<any>;
  hotels: Array<any>;

  getAccessToken: () => Promise<void>;
  refreshToken: () => Promise<void>;
  citySearch: (city: string) => Promise<void>;
  flightOfferSearch: (
    origin: string,
    destination: string,
    adults: number,
    children: number,
    infants: number,
    travelClass: string,
    departureDate: string,
    returnDate?: string,
  ) => Promise<void>;
  hotelSearch: (
    city: string,
    updatedToken: string,
    amenities?: Array<string>,
    ratings?: Array<string>
  ) => Promise<void>;
  hotelRatingSearch: (page: number, updatedToken: string) => Promise<void>;
  hotelOfferSearch: (
    checkIn: string,
    checkOut: string,
    adults: number,
    rooms: number,
    updatedToken: string,
    hotelsId: Array<any>,
    priceRange?: string,
    paymentPolicy?: string,
    boardType?: string
  ) => Promise<void>;
  getHotels: (
    city: string,
    checkIn: string,
    checkOut: string,
    adults: number,
    rooms: number,
    page: number,
    amenities?: Array<string>,
    ratings?: Array<string>,
    priceRange?: string,
    paymentPolicy?: string,
    boardType?: string
  ) => Promise<void>;
  clearError: () => void;
};

export const useAmadeus = create<AmadeusState>((set, get) => ({
  token: "",
  isLoading: false,
  error: null,
  tokenExpires: 0,
  airports: [],
  flightsOffers: {},
  hotelsId: [],
  hotelOffers: [],
  hotels: [],
  hotelRating: [],

  clearError: () => set({ error: null }),

  getAccessToken: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("/api/amadeus/auth", {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch token. Status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.data?.access_token) {
        throw new Error("Invalid token response");
      }

      const expiresAt = Date.now() + data.data.expires_in * 1000;
      set({
        token: data.data.access_token,
        tokenExpires: expiresAt,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get access token";
      set({
        error: { message: errorMessage },
        isLoading: false,
      });
      throw error;
    }
  },

  refreshToken: async () => {
    const { getAccessToken, tokenExpires } = get();
    if (Date.now() > tokenExpires - 60 * 1000) {
      try {
        set({ isLoading: true });
        await getAccessToken();
      } catch (error) {
        set({
          error: { message: "Failed to refresh token" },
          isLoading: false,
        });
        throw error;
      }
    }
  },

  citySearch: async (city: string) => {
    const { refreshToken } = get();
    try {
      set({ isLoading: true, error: null });
      await refreshToken();
      const updatedToken = get().token;

      const response = await fetch("/api/amadeus/city-search", {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({ city, token: updatedToken }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch city data. Status: ${response.status}`);
      }

      const data = await response.json();
      set({ isLoading: false, airports: data.data || [] });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch city data";
      set({
        error: { message: errorMessage },
        isLoading: false,
      });
      throw error;
    }
  },

  flightOfferSearch: async (
    origin: string,
    destination: string,
    adults: number,
    children: number,
    infants: number,
    travelClass: string,
    departureDate: string,
    returnDate?: string
  ) => {
    const { refreshToken } = get();
    try {
      set({ isLoading: true, error: null });
      await refreshToken();
      const updatedToken = get().token;
      set({ isLoading: true, error: null });
      const response = await fetch("/api/amadeus/flight-offer-search", {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({
          origin,
          destination,
          adults,
          children,
          infants,
          travelClass,
          departureDate,
          returnDate,
          token: updatedToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch flight offers. Status: ${response.status}`);
      }

      const data = await response.json();
      set({ isLoading: false, flightsOffers: data.data || {} });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch flight offers";
      set({
        error: { message: errorMessage },
        isLoading: false,
      });
      throw error;
    }
  },

  hotelSearch: async (city: string, updatedToken: string, amenities?: Array<string>, ratings?: Array<string>) => {
    const { refreshToken } = get();
    try {
      set({ isLoading: true, error: null });

      const response = await fetch("/api/amadeus/hotel-search", {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({
          city,
          token: updatedToken,
          amenities,
          ratings
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch hotel data. Status: ${response.status}`);
      }

      const data = await response.json();
      set({ hotelsId: data.hotelsId || [] });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch hotel data";
      set({
        error: { message: errorMessage },
        isLoading: false,
      });
      throw error;
    }
  },

  hotelOfferSearch: async (
    checkIn: string,
    checkOut: string,
    adults: number,
    rooms: number,
    updatedToken: string,
    hotelsId: Array<any>, 
    priceRange?: string,
    paymentPolicy?: string,
    boardType?: string
  ) => {
    const { refreshToken, hotelSearch, } = get();
    try {
      set({ isLoading: true, error: null });

      const response = await fetch("/api/amadeus/hotel-offer-search", {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({
          checkIn,
          checkOut,
          adults,
          rooms,
          hotelsId: hotelsId,
          token: updatedToken,
          priceRange,
          paymentPolicy,
          boardType
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch hotel offers. Status: ${response.status}`);
      }

      const data = await response.json();

      set({ isLoading: false, hotelOffers: data.data.data || [] });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch hotel offers";
      set({
        error: { message: errorMessage },
        isLoading: false,
      });
      throw error;
    }
  },

  hotelRatingSearch: async (page: number, updatedToken: string) => {
    const { hotelOffers, hotels } = get();
    try {
      set({ isLoading: true, error: null });

      // Calculate total pages based on hotel offers
      const totalHotels = hotelOffers.length;
      const hotelsPerPage = 3;
      const maxPage = Math.ceil(totalHotels / hotelsPerPage);

      // Validate page number
      if (page < 1 || page > maxPage) {
        set({ 
          error: { message: "Invalid page number" },
          isLoading: false
        });
        return;
      }

      // Calculate start and end indices for slicing
      const startIndex = (page - 1) * hotelsPerPage;
      const endIndex = Math.min(startIndex + hotelsPerPage, totalHotels);


      // Get hotel IDs for current page
      const slicedHotelIds = hotelOffers
        .slice(startIndex, endIndex)
        .map((offer) => offer.hotel.hotelId);

      // console.log(startIndex, endIndex, slicedHotelIds, hotelOffers);  

      // Fetch ratings for the selected hotels
      const response = await fetch("/api/amadeus/hotel-rating-search", {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({
          token: updatedToken,
          hotelsId: slicedHotelIds
        }),
      });

      if (!response.ok) { 
        throw new Error(`Failed to fetch hotel ratings. Status: ${response.status}`);
      } 

      const data = await response.json();
      
      set({
        hotelRating: data.data.data || [],
        isLoading: false,
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch hotel ratings";
      set({
        error: { message: errorMessage },
        isLoading: false,
      });
      throw error;
    }
  },
  getHotels: async (
    city: string, 
    checkIn: string, 
    checkOut: string, 
    adults: number, 
    rooms: number, 
    page: number, 
    amenities?: Array<string>, 
    ratings?: Array<string>,
    priceRange?: string,
    paymentPolicy?: string,
    boardType?: string
  ) => {
    const { refreshToken, hotelSearch, hotelOfferSearch, hotelRatingSearch } = get();
    try {
      set({ isLoading: true, error: null });
      
      // Get fresh token
      await refreshToken();
      const updatedToken = get().token;

      // Get hotel IDs for the city
      await hotelSearch(city, updatedToken, amenities, ratings);
      const hotelsId = get().hotelsId;

      if (!hotelsId.length) {
        set({ 
          error: { message: "No hotels found for this city" },
          isLoading: false,
          hotels: []
        });
        return;
      }

      // Get offers for the hotels
      await hotelOfferSearch(checkIn, checkOut, adults, rooms, updatedToken, hotelsId, priceRange, paymentPolicy, boardType);
      const hotelOffers = get().hotelOffers;

      if (!hotelOffers.length) {
        set({ 
          error: { message: "No offers available for the selected dates" },
          isLoading: false,
          hotels: []
        });
        return;
      }

      // Get ratings for the current page of hotels
      await hotelRatingSearch(page, updatedToken);
      const hotelRatings = get().hotelRating;

      // Combine offers with ratings
      const updatedHotels = hotelOffers.map((offer: any) => {
        // Find matching rating for this hotel
      
        const rating = hotelRatings.find(
          (rating: any) => rating.hotelId === offer.hotel.hotelId
        );

        // Return new object with combined data
        return {
          ...offer,
          rating: rating ? rating : null,
        };
      });

      // Update state with combined data
      set({ 
        hotels: updatedHotels, 
        isLoading: false,
        error: null
      });

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to fetch hotel data";
        
      set({
        error: { message: errorMessage },
        isLoading: false,
        hotels: []
      });
      throw error;
    }
  }


}));
