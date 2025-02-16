import { create } from "zustand";
import { blogs } from "../lib/data";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type DashboardState = {
    isLoading: boolean; 
    info: any;
    users: Array<any>
    blogs: Array<any>;
    hotels: Array<any>;
    tours: Array<any>;
    cars: Array<any>;
    airlines: Array<any>;
    flightDeals: Array<any>;
    destinations: Array<any>;
    deleteImages(urls: string[]): Promise<void>;
    getInfo(): Promise<void>;
    getUsers(): Promise<void>;
    getBlogs(): Promise<void>;
    getHotels(): Promise<void>;
    getTours(): Promise<void>;
    getCars(): Promise<void>;
    getAirlines(): Promise<void>;
    getFlightDeals(): Promise<void>;
    getDestinations(): Promise<void>;
};

export const useDashboard = create<DashboardState>((set, get) => ({
    isLoading: false,
    info: {},
    users: [],
    blogs: [],
    hotels: [],
    tours: [],
    cars: [],
    airlines: [],
    flightDeals: [],
    destinations: [],
    deleteImages: async (urls: string[]) => {
        if (urls.length === 0) {
            return
        };
        try {
            const response = await fetch("/api/actions/delete-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({urls}),
            });
            const data = await response.json();
            return data;
        } catch (err) {
            console.error("Failed to delete image:", err);
        }
    },
    getInfo: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch("/api/actions/get-info", {
                cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            set({ isLoading: false, info: data.data });
            return data;
        } catch (err) {
            console.error("Failed to get info:", err);
            set({ isLoading: false });
        }
    },
    getUsers: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch("/api/actions/get-users", {
                cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            set({ isLoading: false, users: data.data });
            return data;
        } catch (err) {
            console.error("Failed to get info:", err);
            set({ isLoading: false });
        }
    },
    getBlogs: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch("/api/actions/get-blogs", {
                cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            set({ isLoading: false, blogs: data.data });
            return data;
        } catch (err) {
            console.error("Failed to get info:", err);
            set({ isLoading: false });
        }
    },
    getHotels: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch("/api/actions/get-hotels", {
                cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            set({ isLoading: false, hotels: data.data });
            return data;
        } catch (err) {
            console.error("Failed to get info:", err);
            set({ isLoading: false });
        }
    },
    getTours: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch("/api/actions/get-tours", {
                cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            set({ isLoading: false, tours: data.data });
            return data;
        } catch (err) {
            console.error("Failed to get info:", err);
            set({ isLoading: false });
        }
    },
    getCars: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch("/api/actions/get-cars", {
                cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            set({ isLoading: false, cars: data.data });
            return data;
        } catch (err) {
            console.error("Failed to get info:", err);
            set({ isLoading: false });
        }
    },
    getAirlines: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch("/api/actions/get-airlines", {
                cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            set({ isLoading: false, airlines: data.data });
            return data;
        } catch (err) {
            console.error("Failed to get info:", err);
            set({ isLoading: false });
        }
    },
    getDestinations: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch("/api/actions/get-destinations", {
                cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            set({ isLoading: false, destinations: data.data });
            return data;
        } catch (err) {
            console.error("Failed to get info:", err);
            set({ isLoading: false });
        }
    },
    getFlightDeals: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch("/api/actions/get-flight-deals", {
                cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            set({ isLoading: false, flightDeals: data.data });
            return data;
        } catch (err) {
            console.error("Failed to get info:", err);
            set({ isLoading: false });
        }
    },
}))