import { CarOffer } from "@/types";
import { create } from "zustand";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface CarSearchParams {
  pickUpLocation: string;
  dropOffLocation?: string;
  pickUpDate: string;
  dropOffDate: string;
  pickUpTime: string;    
  dropOffTime: string;  
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
  offerId?: string;
  provider?: string;
  providers?: string[];
}

interface CarState {
  carOffers: CarOffer[];
  filteredCars: CarOffer[];
  isLoading: boolean;
  error: string | null;
  carOffer: CarOffer | null;

  searchCarOffers: (params: CarSearchParams) => Promise<void>;
  searchCarOffer: (offerId: string, params: Partial<CarSearchParams>) => Promise<any>;
  getCarOffer: (params: Partial<CarSearchParams>) => Promise<any>;
  setFilteredCars: (cars: CarOffer[]) => void;
  applyFilters: (filters: Partial<CarSearchParams>) => void;
}

const CATEGORY_ORDER = [
  'economy',
  'compact',
  'intermediate',
  'standard',
  'fullsize',
  'premium',
  'luxury',
  'suv',
  'van',
  'pickup'
];

export const useCar = create<CarState>((set, get) => ({
  carOffers: [],
  carOffer: null,
  filteredCars: [],
  isLoading: false,
  error: null,

  searchCarOffers: async (params: CarSearchParams) => {
    set({ isLoading: true, error: null });

    try {
        const providers = params.providers;

        if (!providers || providers.length === 0) {
            throw new Error('No Provider to fetch Data');
        }

        const offers: CarOffer[] = [];

        for (const provider of providers) {
            try {
                let response;
                if (provider === 'direct') {
                    response = await fetch('/api/actions/get-car-offers', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            pickUpLocation: params.pickUpLocation,
                            dropOffLocation: params.dropOffLocation,
                            pickUpDate: params.pickUpDate,
                            dropOffDate: params.dropOffDate,
                            pickUpTime: params.pickUpTime,
                            dropOffTime: params.dropOffTime,
                            market: params.market || 'US',
                        }),
                    });
                } else {
                    response = await fetch(`/api/${provider}/car-offers`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            pickUpLocation: params.pickUpLocation,
                            dropOffLocation: params.dropOffLocation,
                            pickUpDate: params.pickUpDate,
                            dropOffDate: params.dropOffDate,
                            pickUpTime: params.pickUpTime,
                            dropOffTime: params.dropOffTime,
                            driverAge: params.driverAge || 30,
                            market: params.market || 'US',
                            locale: params.locale || 'en-US',
                            currency: params.currency || 'USD',
                        }),
                    });
                }

                if (!response.ok) {
                    throw new Error(`Failed to fetch car offers from ${provider}`);
                }

                const data = await response.json();

                if (!data.data) {
                    throw new Error(data.error || `Failed to fetch car offers from ${provider}`);
                }

                // Add provider information to each offer
                const providerOffers = data.data.map((offer: CarOffer) => ({
                    ...offer,
                    provider
                }));

                offers.push(...providerOffers);
            } catch (error) {
                console.error(`Error fetching from ${provider}:`, error);
                // Continue with other providers even if one fails
                continue;
            }
        }

        if (offers.length === 0) {
            throw new Error('No car offers found from any provider');
        }

        set({
            carOffers: offers,
            filteredCars: offers,
            isLoading: false,
        });

        // Apply any existing filters after loading new data
        if (params.priceRange || params.transmission?.length || params.category?.length ||
            params.features?.length || params.fuelType?.length || params.vendor?.length) {
            get().applyFilters(params);
        }
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
      let carOffer: CarOffer | null = null;

      if (params.provider === 'skyscanner') {
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

        if (response.ok) {
          const data = await response.json();
          carOffer = data.success ? data.offer : null;
        }
      } else {
        const response = await fetch(`/api/${params.provider}/car-offer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            offerId,
            ...params,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          carOffer = data.success ? data.offer : null;
        }
      }

      if (!carOffer) {
        throw new Error('No car data found');
      }

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

  getCarOffer: async (params: Partial<CarSearchParams>) => {
    set({ isLoading: true, error: null });
    try {
        if (params.provider === 'direct') {
            const response = await fetch('/api/actions/get-car-offer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: params.offerId,
                }),
            });
            const data = await response.json();
            set({ isLoading: false, carOffer: data.data });
            return data.data;
        } else {
            const response = await fetch(`/api/${params.provider}/car-offer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            const data = await response.json();
            if (data.success) {
                set({ isLoading: false, carOffer: data.data });
                return data.data;
            } else {
                set({ isLoading: false, carOffer: null });
                throw new Error(data.error);    
            }
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch car offer';
        set({
            error: errorMessage,
            isLoading: false,
            carOffer: null
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
      const min = filters.priceRange.min || 0;
      const max = filters.priceRange.max || Infinity;
      filtered = filtered.filter(car => {
        const price = car.price.amount;
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
        return filters.features?.every(feature => {
          switch (feature) {
            case 'AIR_CONDITIONING':
              return car.features.airConditioning;
            case 'THIRD_ROW_SEATS':
              return car.features.seats >= 7;
            default:
              return false;
          }
        });
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

    // Sort results
    filtered.sort((a, b) => {
      // First by price
      if (a.price.amount !== b.price.amount) {
        return a.price.amount - b.price.amount;
      }
      
      // Then by category if prices are equal
      const categoryA = CATEGORY_ORDER.indexOf(a.features.category.toLowerCase());
      const categoryB = CATEGORY_ORDER.indexOf(b.features.category.toLowerCase());
      if (categoryA !== categoryB) {
        return categoryA - categoryB;
      }
      
      // Then by passenger capacity
      if (a.features.seats !== b.features.seats) {
        return b.features.seats - a.features.seats;
      }
      
      // Finally by luggage capacity
      const luggageA = a.features.baggageCapacity.large + (a.features.baggageCapacity.small * 0.5);
      const luggageB = b.features.baggageCapacity.large + (b.features.baggageCapacity.small * 0.5);
      return luggageB - luggageA;
    });

    set({ filteredCars: filtered });
  },
}));