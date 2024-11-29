import { create } from "zustand";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type AmadeusState = {
    token: string;
    isLoading: boolean;
    tokenExpires: number;
    getAccessToken: () => Promise<void>;
    refreshToken: () => Promise<void>;
};

export const useAmadeus = create<AmadeusState>((set, get) => ({
    token: "",
    isLoading: false,
    tokenExpires: 0,

    getAccessToken: async () => {
        set({ isLoading: true });
        try {
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
            const expiresAt = Date.now() + data.expires_in * 1000;

            set({ 
                token: data.access_token, 
                tokenExpires: expiresAt, 
                isLoading: false 
            });
        } catch (error) {
            console.error("Failed to get access token:", error);
            set({ isLoading: false });
        }
    },

    refreshToken: async () => {
        const { getAccessToken, tokenExpires } = get();
        if (Date.now() > tokenExpires - 60 * 1000) {
            try {
                await getAccessToken();
            } catch (error) {
                console.error("Failed to refresh token:", error);
            }
        }
    },
}));
