import { create } from "zustand";
import { blogs } from "../lib/data";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type DashboardState = {
    isLoading: boolean; 
    info: any;
    users: Array<any>
    bookings: Array<any>;
    receipts: Array<any>;
    blogs: Array<any>;
    hotelOffers: Array<any>;
    tours: Array<any>;
    carOffers: Array<any>;
    flightOffers: Array<any>;
    flightDeals: Array<any>;
    destinations: Array<any>;
    privacyPolicy: string;
    termsAndConditions: string;
    fetchPrivacyPolicy: () => Promise<void>;
    fetchTermsAndConditions: () => Promise<void>;
    updatePrivacyPolicy: (content: string) => Promise<void>;
    updateTermsAndConditions: (content: string) => Promise<void>;
    deleteImages(urls: string[]): Promise<void>;
    getInfo(): Promise<void>;
    getUsers(): Promise<void>;
    getBookings(filter?: string): Promise<void>;
    getReceipts(filter?: string): Promise<void>;
    updateBookings(update: any): Promise<void>;
    getBlogs(): Promise<void>;
    getHotelOffers(): Promise<void>;
    getTours(): Promise<void>;
    getCarOffers(): Promise<void>;
    getFlightOffers(): Promise<void>;
    getFlightDeals(): Promise<void>;
    getDestinations(): Promise<void>;
};

export const useDashboard = create<DashboardState>((set, get) => ({
    isLoading: false,
    info: {},
    users: [],
    bookings: [],
    receipts: [],
    blogs: [],
    hotelOffers: [],
    tours: [],
    carOffers: [],
    flightOffers: [],
    flightDeals: [],
    destinations: [],
    privacyPolicy: '',
    termsAndConditions: '',
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
    getBookings: async (filter: string = 'all') => {
        set({ isLoading: true });
        try {
            const response = await fetch("/api/actions/get-bookings", {
                cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ filter }),
            });
            const data = await response.json();
            set({ isLoading: false, bookings: data.data });
            return data;
        } catch (err) {
            console.error("Failed to get bookings:", err);
            set({ isLoading: false });
        }
    },
    getReceipts: async (filter: string = 'all') => {
        set({ isLoading: true });
        try {
            const response = await fetch("/api/actions/get-receipts", {
                cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ filter }),
            });
            const data = await response.json();
            set({ isLoading: false, receipts: data.data });
            return data;
        } catch (err) {
            console.error("Failed to get receipts:", err);
            set({ isLoading: false });
        }
    },
    updateBookings: async (update) => {
        set({ isLoading: true });
        try {
            const response = await fetch("/api/actions/update-booking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(update),
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update booking');
            }

            // Update local state
            set(state => ({
                bookings: state.bookings.map(booking => 
                    booking.bookingId === update.bookingId 
                        ? { ...booking, ...update }
                        : booking
                )
            }));

            set({ isLoading: false });
            return data;
        } catch (err) {
            console.error("Failed to update booking:", err);
            set({ isLoading: false });
            throw err;
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
    getHotelOffers: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch("/api/actions/get-hotel-offers", {
                cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            set({ isLoading: false, hotelOffers: data.data });
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
    getCarOffers: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch("/api/actions/get-car-offers", {
                cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            set({ isLoading: false, carOffers: data.data });
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

    getFlightOffers: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch("/api/actions/get-flight-offers", {
                cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            set({ isLoading: false, flightOffers: data.data });
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
    // Fetch Privacy Policy
  fetchPrivacyPolicy: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/actions/get-privacy-policy");
      const data = await response.json();
      if (data.success) {
        set({ privacyPolicy: data.content });
      } else {
        throw new Error(data.error || "Failed to fetch privacy policy");
      }
    } catch (err) {
        console.error("Failed to get info:", err);
        set({ isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch Terms & Conditions
  fetchTermsAndConditions: async () => {
    set({ isLoading: true});
    try {
      const response = await fetch("/api/actions/get-terms-and-conditions");
      const data = await response.json();
      if (data.success) {
        set({ termsAndConditions: data.content });
      } else {
        throw new Error(data.error || "Failed to fetch terms and conditions");
      }
    } catch (err) {
        console.error("Failed to get info:", err);
        set({ isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  // Update Privacy Policy
  updatePrivacyPolicy: async (content: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/actions/update-privacy-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update privacy policy");
      }
      set({ privacyPolicy: content });
    } catch (err) {
        console.error("Failed to get info:", err);
        set({ isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  // Update Terms & Conditions
  updateTermsAndConditions: async (content: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/actions/update-terms-and-conditions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update terms and conditions");
      }
      set({ termsAndConditions: content });
    } catch (err) {
        console.error("Failed to get info:", err);
        set({ isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
}))