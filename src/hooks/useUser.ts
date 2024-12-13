import { create } from "zustand";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type userState = {
  user: any;
  isLoading: boolean;
  getUser: () => Promise<void>;
};

export const useUser = create<userState>((set) => ({
  user: {},
  isLoading: false,
  getUser: async () => {
    set({ isLoading: true });
    try {
        const response = await fetch("/api/actions/get-user", {
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        set({ isLoading: false, user: data.data });
        return data;
    } catch (err) {
        console.error("Failed to get info:", err);
        set({ isLoading: false });
    }
},
}));
  