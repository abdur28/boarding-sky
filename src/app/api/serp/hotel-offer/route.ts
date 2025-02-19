// import { NextResponse } from "next/server";
// import { unstable_noStore as noStore } from "next/cache";
// import { HotelOffer, HotelOfferDetails, SerpApiHotelOffer } from "@/types";

// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

// const SERP_API_KEY = process.env.SERP_API_KEY;
// const BASE_URL = "https://serpapi.com/search.json";

// export async function POST(req: Request) {
//     noStore();
//     try {
//         const {
//             propertyToken,
//             q = "Hotels", // Default search query
//             checkIn,
//             checkOut,
//             adults = 2,
//             currency = "USD",
//         } = await req.json();

//         if (!propertyToken) {
//             throw new Error('Property token is required');
//         }

//         // Construct query parameters
//         const params = new URLSearchParams({
//             engine: "google_hotels",
//             q: q,
//             property_token: propertyToken,
//             check_in_date: checkIn,
//             check_out_date: checkOut,
//             adults: adults.toString(),
//             currency: currency,
//             gl: "us",
//             hl: "en",
//             api_key: SERP_API_KEY!,
//         });

//         const response = await fetch(`${BASE_URL}?${params.toString()}`);

//         if (!response.ok) {
//             throw new Error(`SerpAPI request failed with status ${response.status}`);
//         }

//         const data = await response.json();

//         // Transform to match our HotelOfferDetails type
//         const hotelDetails: HotelOfferDetails = {
//             type: data.type === 'vacation rental' ? 'vacation_rental' : 'hotel',
//             id: propertyId,
//             provider: 'serp',
//             propertyId: propertyId,
//             name: data.name,
//             description: data.description,
//             rooms: data.featured_prices?.[0]?.rooms?.map((room: any) => ({
//                 id: `${propertyId}-${room.name.toLowerCase().replace(/\s+/g, '-')}`,
//                 name: room.name,
//                 maxOccupancy: room.num_guests,
//                 amenities: [], // Room-specific amenities if available
//                 images: room.images?.map((img: string) => ({
//                     url: img,
//                     alt: `${room.name} - ${data.name}`
//                 })) || [],
//                 price: {
//                     amount: room.rate_per_night.extracted_lowest,
//                     currency: currency,
//                     breakdown: {
//                         baseRate: room.rate_per_night.extracted_before_taxes_fees,
//                         taxes: room.rate_per_night.extracted_lowest - room.rate_per_night.extracted_before_taxes_fees,
//                         fees: 0 // If available from API
//                     }
//                 },
//                 cancellationPolicy: data.prices?.[0]?.free_cancellation ? {
//                     isCancellable: true,
//                     deadline: `${data.prices[0].free_cancellation_until_date} ${data.prices[0].free_cancellation_until_time || ''}`
//                 } : {
//                     isCancellable: false
//                 }
//             })) || [],
//             availableRooms: data.numberOfBookableSeats,
//             bookingOptions: {
//                 paymentTypes: [],
//                 guarantee: {
//                     required: data.prices?.[0]?.deposit_required || false,
//                     amount: data.prices?.[0]?.deposit_amount,
//                     currency: currency
//                 }
//             }
//         };

//         // Transform to match our SerpApiHotelOffer type for the overview
//         const hotelOffer: SerpApiHotelOffer = {
//             id: propertyId,
//             provider: 'serpapi',
//             type: data.type === 'vacation rental' ? 'apartment' : 'hotel',
//             name: data.name,
//             description: data.description,
//             location: {
//                 latitude: data.gps_coordinates.latitude,
//                 longitude: data.gps_coordinates.longitude,
//                 address: data.address,
//             },
//             hotelClass: data.extracted_hotel_class,
//             checkIn: data.check_in_time,
//             checkOut: data.check_out_time,
//             amenities: data.amenities || [],
//             images: data.images.map((img: any) => ({
//                 thumbnail: img.thumbnail,
//                 original: img.original_image,
//                 alt: `${data.name} - Hotel Image`
//             })),
//             price: {
//                 current: data.rate_per_night.extracted_before_taxes_fees,
//                 original: data.rate_per_night.extracted_lowest,
//                 currency: currency,
//                 beforeTaxes: data.rate_per_night.extracted_before_taxes_fees,
//                 includesTaxes: true,
//                 ...(data.deal && {
//                     discount: {
//                         label: data.deal_description || "Special Offer",
//                         amount: data.rate_per_night.extracted_lowest - data.rate_per_night.extracted_before_taxes_fees,
//                         percentage: parseFloat(data.deal.match(/\d+/)[0])
//                     }
//                 })
//             },
//             rating: {
//                 overall: data.overall_rating,
//                 totalReviews: data.reviews,
//                 location: data.location_rating,
//                 breakdown: data.reviews_breakdown?.map((rb: any) => ({
//                     name: rb.name,
//                     description: rb.description,
//                     totalMentions: rb.total_mentioned,
//                     positive: rb.positive,
//                     negative: rb.negative,
//                     neutral: rb.neutral,
//                 }))
//             },
//             brand: data.featured_prices?.[0]?.logo ? {
//                 name: data.featured_prices[0].source,
//                 logo: data.featured_prices[0].logo,
//             } : undefined,
//             nearbyPlaces: data.nearby_places?.map((place: any) => ({
//                 name: place.name,
//                 category: place.category,
//                 rating: place.rating,
//                 reviews: place.reviews,
//                 transportations: place.transportations,
//             })),
//             refundable: data.prices?.[0]?.free_cancellation || false,
//             sponsored: data.sponsored || false,
//             propertyToken: propertyId,
//             serpapi_property_details_link: data.serpapi_property_details_link,
//             meta: {
//                 typicalPriceRange: data.typical_price_range,
//                 ecoCertified: data.eco_certified,
//                 dealDescription: data.deal_description
//             }
//         };

//         return NextResponse.json({
//             offer: hotelOffer,
//             details: hotelDetails,
//             success: true,
//         });

//     } catch (error) {
//         console.error('Error in hotel-offer:', error);
//         return NextResponse.json(
//             {
//                 error: error instanceof Error ? error.message : 'Failed to fetch hotel offer',
//                 success: false,
//             },
//             { status: 500 }
//         );
//     }
// }

import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { HotelOffer, HotelOfferDetails, SerpApiHotelOffer } from "@/types";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
    noStore();
    try {
        const mockHotelOffer: SerpApiHotelOffer = {
            id: "mock-hotel-1",
            provider: 'serp',
            type: 'hotel',
            name: "Grand Luxury Resort & Spa",
            description: "Discover unparalleled luxury at our beachfront resort, featuring world-class amenities including infinity pools, private beach access, and award-winning restaurants. Each elegantly appointed room offers stunning ocean views and modern conveniences.",
            location: {
                latitude: -8.8256848,
                longitude: 115.2186745,
                address: "Jl. Luxury Beach Road 123, Paradise Island",
                cityCode: "DPS",
                countryCode: "ID"
            },
            hotelClass: 5,
            checkIn: "15:00",
            checkOut: "12:00",
            amenities: [
                "Free Wi-Fi",
                "Infinity Pool",
                "Spa",
                "Beach Access",
                "Fitness Center",
                "24/7 Room Service",
                "Multiple Restaurants",
                "Business Center",
                "Kids Club",
                "Concierge Service"
            ],
            images: [
                {
                    thumbnail: "/api/placeholder/400/300",
                    original: "/api/placeholder/1200/900",
                    alt: "Luxury Resort Main View"
                },
                {
                    thumbnail: "/api/placeholder/400/300",
                    original: "/api/placeholder/1200/900",
                    alt: "Infinity Pool"
                },
                {
                    thumbnail: "/api/placeholder/400/300",
                    original: "/api/placeholder/1200/900",
                    alt: "Deluxe Room"
                }
            ],
            price: {
                current: 350,
                original: 450,
                currency: "USD",
                beforeTaxes: 320,
                includesTaxes: true,
                discount: {
                    label: "Special Offer",
                    amount: 100,
                    percentage: 22
                }
            },
            rating: {
                overall: 4.8,
                totalReviews: 1250,
                location: 4.9,
                breakdown: [
                    {
                        name: "Cleanliness",
                        description: "Property Cleanliness",
                        totalMentions: 850,
                        positive: 820,
                        negative: 10,
                        neutral: 20
                    },
                    {
                        name: "Service",
                        description: "Staff Service",
                        totalMentions: 750,
                        positive: 700,
                        negative: 25,
                        neutral: 25
                    }
                ]
            },
            brand: {
                name: "Luxury Hotels International",
                logo: "/api/placeholder/120/40"
            },
            nearbyPlaces: [
                {
                    name: "Paradise Beach",
                    category: "Beach",
                    rating: 4.7,
                    reviews: 3500,
                    transportations: [
                        {
                            type: "Walking",
                            duration: "5 min"
                        }
                    ]
                },
                {
                    name: "Local Market",
                    category: "Shopping",
                    rating: 4.5,
                    reviews: 1200,
                    transportations: [
                        {
                            type: "Taxi",
                            duration: "10 min"
                        },
                        {
                            type: "Walking",
                            duration: "20 min"
                        }
                    ]
                }
            ],
            refundable: true,
            sponsored: false,
            propertyToken: "mock-property-token",
            serpapi_property_details_link: "https://serpapi.com/hotel/details/mock",
            availableRooms: 5,
            badges: ["Beachfront", "Luxury", "Spa Resort"],
            meta: {
                typicalPriceRange: {
                    min: 350,
                    max: 800
                },
                ecoCertified: true,
                dealDescription: "Summer Special - 22% off"
            }
        };

        const mockHotelDetails: HotelOfferDetails = {
            type: 'hotel',
            id: "mock-hotel-1",
            propertyId: "mock-property-token",
            name: "Grand Luxury Resort & Spa",
            description: "Discover unparalleled luxury at our beachfront resort.",
            rooms: [
                {
                    id: "deluxe-ocean",
                    name: "Deluxe Ocean View Room",
                    description: "Spacious room with stunning ocean views",
                    maxOccupancy: 2,
                    amenities: [
                        "King Bed",
                        "Ocean View",
                        "Private Balcony",
                        "Mini Bar",
                        "Rain Shower"
                    ],
                    images: [
                        {
                            url: "/api/placeholder/800/600",
                            alt: "Deluxe Ocean View Room"
                        }
                    ],
                    price: {
                        amount: 350,
                        currency: "USD",
                        breakdown: {
                            baseRate: 320,
                            taxes: 20,
                            fees: 10
                        }
                    },
                    cancellationPolicy: {
                        isCancellable: true,
                        deadline: "2024-02-13 15:00:00",
                        penalties: [
                            {
                                from: "2024-02-13 15:00:00",
                                amount: 350,
                                currency: "USD"
                            }
                        ]
                    }
                },
                {
                    id: "suite-premium",
                    name: "Premium Suite",
                    description: "Luxury suite with separate living area",
                    maxOccupancy: 3,
                    amenities: [
                        "King Bed",
                        "Separate Living Area",
                        "Premium Ocean View",
                        "Jacuzzi",
                        "Butler Service"
                    ],
                    images: [
                        {
                            url: "/api/placeholder/800/600",
                            alt: "Premium Suite"
                        }
                    ],
                    price: {
                        amount: 550,
                        currency: "USD",
                        breakdown: {
                            baseRate: 500,
                            taxes: 35,
                            fees: 15
                        }
                    },
                    cancellationPolicy: {
                        isCancellable: true,
                        deadline: "2024-02-13 15:00:00"
                    }
                }
            ],
            availableRooms: 5,
            bookingOptions: {
                paymentTypes: ["Credit Card", "Bank Transfer"],
                guarantee: {
                    required: true,
                    amount: 100,
                    currency: "USD"
                }
            }
        };

        return NextResponse.json({
            offer: mockHotelOffer,
            details: mockHotelDetails,
            success: true,
        });

    } catch (error) {
        console.error('Error in hotel-offer:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to fetch hotel offer',
                success: false,
            },
            { status: 500 }
        );
    }
}