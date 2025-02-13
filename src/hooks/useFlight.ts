import { FlightOffer, FlightSearchParams, Provider, ProviderTokens } from "@/types";
import { create } from "zustand";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface FlightState {
    flightOffers: FlightOffer[];
    filteredFlights: FlightOffer[];
    tokens: ProviderTokens;
    isLoading: boolean;
    error: string | null;

    getProviderToken: (providerId: string) => Promise<void>;
    searchFlightOffers: (params: FlightSearchParams) => Promise<void>;
    setFilteredFlights: (flights: FlightOffer[]) => void;
} 

export const useFlight = create<FlightState>((set, get) => ({
    flightOffers: [],
    filteredFlights: [],
    tokens: {},
    isLoading: false,
    error: null,

    getProviderToken: async (providerId: string) => {
        set({ isLoading: true, error: null });
        const tokens = get().tokens;
        const currentToken = tokens[providerId];

        // Check if token exists and is not expired (with 1-minute buffer)
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
    
            // Update tokens in state
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
    
    searchFlightOffers: async (params: FlightSearchParams) => {
        set({ isLoading: true, error: null });
    
        try {
            const { getProviderToken} = get();
            
            if (params.providerIds && params.providerIds.length === 0) {
                throw new Error('No providers selected');
            }
    
            // Get tokens for all providers in parallel
            const tokens = await Promise.all(
                params.providerIds!.map(async (providerId) => {
                    try {
                        const token = await getProviderToken(providerId);
                        set({ isLoading: true, error: null });
                        return { providerId, token, success: true };
                    } catch (error) {
                        console.error(`Failed to get token for ${providerId}:`, error);
                        return { providerId, token: null, success: false };
                    }
                })
            );
    
            // Filter out providers where token fetch failed
            const validTokens = tokens.filter(t => t.success);
    
            if (validTokens.length === 0) {
                throw new Error('Failed to authenticate with any provider');
            }
    
            // Search flights from each provider
            const responses = await Promise.all(
                validTokens.map(async ({ providerId, token }) => {
                    const response = await fetch(`/api/${providerId}/flight-offers`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: JSON.stringify({...params, token }),
                    });
    
                    if (!response.ok) {
                        throw new Error(`Failed to fetch flights from ${providerId}`);
                    }
    
                    const data = await response.json();
                    return data.data || [];
                })
            );
    
            // Combine all flight offers
            const allFlights = responses.flat();
    
            if (allFlights.length === 0) {
                throw new Error('No flights found from any provider');
            }
    
            // Sort flights by price
            const sortedFlights = allFlights.sort((a, b) => 
                (typeof a.price === 'number' ? a.price : a.price.amount) - 
                (typeof b.price === 'number' ? b.price : b.price.amount)
            );

            console.log('Flight offers:', sortedFlights);
    
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
    
    setFilteredFlights: (flights) => set({ filteredFlights: flights }),
}));