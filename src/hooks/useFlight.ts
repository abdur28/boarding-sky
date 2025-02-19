import { FlightOffer, FlightSearchParams } from "@/types";
import { create } from "zustand";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface FlightState {
    flightOffers: FlightOffer[];
    filteredFlights: FlightOffer[];
    isLoading: boolean;
    error: string | null;
    flightOffer: FlightOffer | null;

    searchFlightOffers: (params: FlightSearchParams) => Promise<void>;
    searchFlightOffer: (offerId: string, params: Partial<FlightSearchParams>) => Promise<any>;
    getFlightOffer: (params: Partial<FlightSearchParams>) => Promise<any>;
    setFilteredFlights: (flights: FlightOffer[]) => void;
}

export const useFlight = create<FlightState>((set, get) => ({
    flightOffers: [],
    filteredFlights: [],
    flightOffer: null,
    isLoading: false,
    error: null,

    searchFlightOffers: async (params: FlightSearchParams) => {
        set({ isLoading: true, error: null });

        try {
            const providers = params.providerIds;

            if (!providers || providers.length === 0) {
                throw new Error('No Provider to fetch Data');
            }

            const offers: FlightOffer[] = [];

            for (const provider of providers) {
                try {
                    let response;
                    if (provider === 'direct') {
                        response = await fetch('/api/actions/get-flight-offers', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                origin: params.origin,
                                destination: params.destination,
                                departureDate: params.departureDate,
                                returnDate: params.returnDate,
                                adults: params.adults,
                                children: params.children,
                                infants: params.infants,
                                travelClass: params.travelClass
                            }),
                        });
                    } else {
                        response = await fetch(`/api/${provider}/flight-offers`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(params),
                        });
                    }

                    if (!response.ok) {
                        throw new Error(`Failed to fetch flight offers from ${provider}`);
                    }

                    const data = await response.json();

                    if (!data.data) {
                        throw new Error(data.error || `Failed to fetch flight offers from ${provider}`);
                    }

                    // Add provider information to each offer
                    const providerOffers = data.data.map((offer: FlightOffer) => ({
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
                throw new Error('No flight offers found from any provider');
            }

            // Sort flights by price
            const sortedFlights = offers.sort((a, b) => 
                a.price.amount - b.price.amount
            );

            set({
                flightOffers: sortedFlights,
                filteredFlights: sortedFlights,
                isLoading: false,
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch flights';
            set({
                error: errorMessage,
                isLoading: false,
                flightOffers: [],
                filteredFlights: [],
            });
        }
    },

    getFlightOffer: async (params: Partial<FlightSearchParams>) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/actions/get-flight-offer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            
            const data = await response.json();
            if (data.data) {
                set({ isLoading: false, flightOffer: data.data });
                return data.data;
            } else {
                set({ isLoading: false, flightOffer: null });
                throw new Error(data.error || 'Failed to fetch flight offer');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch flight offer';
            set({
                error: errorMessage,
                isLoading: false,
                flightOffer: null
            });
            throw error;
        }
    },

    searchFlightOffer: async (offerId: string, params: Partial<FlightSearchParams>) => {
        set({ isLoading: true, error: null });

        try {
            const response = await fetch('/api/actions/get-flight-offer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    offerId,
                    ...params
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch flight offer');
            }

            const data = await response.json();
            
            if (!data.data) {
                throw new Error('No flight data found');
            }

            set({
                flightOffers: [data.data],
                filteredFlights: [data.data],
                isLoading: false,
            });

            return data.data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch flight offer';
            set({
                error: errorMessage,
                isLoading: false,
                flightOffers: [],
                filteredFlights: [],
            });
            throw error;
        }
    },

    setFilteredFlights: (flights) => set({ filteredFlights: flights }),
}));