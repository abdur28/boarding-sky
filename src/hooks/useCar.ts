import { CarOffer } from "@/types";
import { create } from "zustand";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface CarSearchParams {
  pickUpLocation: string;
  dropOffLocation?: string;
  pickUpDate: string;
  dropOffDate: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  transmission?: string[];
  category?: string[];
  features?: string[];
  fuelType?: string[];
  vendor?: string[];
  market?: string;
  locale?: string;
  currency?: string;
  driverAge?: number;
}

interface CarState {
  carOffers: CarOffer[];
  filteredCars: CarOffer[];
  isLoading: boolean;
  error: string | null;

  searchCarOffers: (params: CarSearchParams) => Promise<void>;
  searchCarOffer: (offerId: string, params: Partial<CarSearchParams>) => Promise<CarOffer>;
  setFilteredCars: (cars: CarOffer[]) => void;
  applyFilters: (filters: Partial<CarSearchParams>) => void;
}

export const useCar = create<CarState>((set, get) => ({
  carOffers: [],
  filteredCars: [],
  isLoading: false,
  error: null,

  searchCarOffers: async (params: CarSearchParams) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/skyscanner/car-offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pickUpLocation: params.pickUpLocation,
          dropOffLocation: params.dropOffLocation,
          pickUpDate: params.pickUpDate,
          dropOffDate: params.dropOffDate,
          driverAge: params.driverAge || 30,
          market: params.market || 'UK',
          locale: params.locale || 'en-GB',
          currency: params.currency || 'GBP'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch car offers');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch car offers');
      }

      const offers = data.offers || [];

      set({
        carOffers: offers,
        filteredCars: offers,
        isLoading: false,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch car offers';
      set({
        error: errorMessage,
        isLoading: false,
        carOffers: [],
        filteredCars: [],
      });
    }
  },

  searchCarOffer: async (offerId: string, params: Partial<CarSearchParams>) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/skyscanner/car-offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offerId,
          ...params,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch car offer');
      }

      const data = await response.json();
      
      if (!data.success || !data.offer) {
        throw new Error('No car data found');
      }

      const carOffer = data.offer;

      set({
        carOffers: [carOffer],
        filteredCars: [carOffer],
        isLoading: false,
      });

      return carOffer;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch car offer';
      set({
        error: errorMessage,
        isLoading: false,
        carOffers: [],
        filteredCars: [],
      });
      throw error;
    }
  },

  setFilteredCars: (cars) => set({ filteredCars: cars }),

  applyFilters: (filters: Partial<CarSearchParams>) => {
    const { carOffers } = get();
    let filtered = [...carOffers];

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(car => {
        const price = car.price.amount;
        const min = filters.priceRange?.min || 0;
        const max = filters.priceRange?.max || Infinity;
        return price >= min && price <= max;
      });
    }

    // Transmission filter
    if (filters.transmission?.length) {
      filtered = filtered.filter(car => 
        filters.transmission?.includes(car.features.transmission.toUpperCase())
      );
    }

    // Category filter
    if (filters.category?.length) {
      filtered = filtered.filter(car => 
        filters.category?.includes(car.features.category.toUpperCase())
      );
    }

    // Features filter
    if (filters.features?.length) {
      filtered = filtered.filter(car => {
        // Convert car features to a comparable format
        const carFeatures = [
          car.features.airConditioning ? 'AIR_CONDITIONING' : '',
          // Add other feature mappings as needed
        ].filter(Boolean);

        return filters.features?.some(feature => carFeatures.includes(feature));
      });
    }

    // Fuel type filter
    if (filters.fuelType?.length) {
      filtered = filtered.filter(car => 
        filters.fuelType?.includes(car.features.fuelType.toUpperCase())
      );
    }

    // Vendor filter
    if (filters.vendor?.length) {
      filtered = filtered.filter(car => 
        filters.vendor?.includes(car.vendor.id)
      );
    }

    set({ filteredCars: filtered });
  },
}));