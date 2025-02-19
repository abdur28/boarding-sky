// import { NextResponse } from "next/server";
// import { unstable_noStore as noStore } from "next/cache";
// import { HotelOffer } from "@/types";

// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

// const SERP_API_KEY = process.env.SERP_API_KEY;
// const BASE_URL = "https://serpapi.com/search.json";

// export async function POST(req: Request) {
//     noStore();
//     try {
//         const {
//             city,
//             checkIn,
//             checkOut,
//             adults = 2,
//             children = 0,
//             rooms = 1,
//             priceRange,
//             amenities,
//             ratings,
//             currency = "USD",
//         } = await req.json();

//         // Construct query parameters
//         const params = new URLSearchParams({
//             engine: "google_hotels",
//             q: `${city} Hotels`,
//             check_in_date: checkIn,
//             check_out_date: checkOut,
//             adults: adults.toString(),
//             currency: currency,
//             gl: "us", // Google location (country)
//             hl: "en", // Language
//             api_key: SERP_API_KEY!,
//         });

//         if (children > 0) {
//             params.append("children", children.toString());
//         }

//         const response = await fetch(`${BASE_URL}?${params.toString()}`);

//         if (!response.ok) {
//             throw new Error(`SerpAPI request failed with status ${response.status}`);
//         }

//         const data = await response.json();

//         // Transform SerpAPI response to match our HotelOffer type
//         const transformedOffers: HotelOffer[] = data.properties.map((property: any) => ({
//             id: property.property_token,
//             proopertyToken: 'property.property_token',
//             type: property.type,
//             name: property.name,
//             provider: 'serp',
//             description: property.description,
//             location: {
//                 latitude: property.gps_coordinates.latitude,
//                 longitude: property.gps_coordinates.longitude,
//                 address: property.address,
//             },
//             hotelClass: property.extracted_hotel_class,
//             checkIn: property.check_in_time,
//             checkOut: property.check_out_time,
//             amenities: property.amenities,
//             images: property.images.map((img: any) => ({
//                 thumbnail: img.thumbnail,
//                 original: img.original_image,
//             })),
//             price: {
//                 current: parseFloat(property.rate_per_night.extracted_before_taxes_fees || 
//                                  property.rate_per_night.extracted_lowest),
//                 original: property.rate_per_night.extracted_lowest,
//                 currency: currency,
//                 beforeTaxes: parseFloat(property.rate_per_night.extracted_before_taxes_fees),
//                 includesTaxes: true,
//                 ...(property.deal && {
//                     discount: {
//                         label: property.deal_description || "Special Offer",
//                         amount: property.rate_per_night.extracted_lowest - 
//                                property.rate_per_night.extracted_before_taxes_fees,
//                     }
//                 })
//             },
//             rating: {
//                 overall: property.overall_rating,
//                 totalReviews: property.reviews,
//                 location: property.location_rating,
//                 breakdown: property.reviews_breakdown?.map((rb: any) => ({
//                     name: rb.name,
//                     description: rb.description,
//                     totalMentions: rb.total_mentioned,
//                     positive: rb.positive,
//                     negative: rb.negative,
//                     neutral: rb.neutral,
//                 }))
//             },
//             brand: property.logo ? {
//                 name: property.brand_name || "",
//                 logo: property.logo,
//             } : undefined,
//             nearbyPlaces: property.nearby_places?.map((place: any) => ({
//                 name: place.name,
//                 transportations: place.transportations,
//             })),
//             sponsored: property.sponsored || false,
//             propertyToken: property.property_token,
//             meta: {
//                 serpApiLink: property.serpapi_property_details_link,
//             }
//         }));
        

//         // Apply filters if provided
//         let filteredOffers = transformedOffers;

//         // Filter by price range
//         if (priceRange?.min || priceRange?.max) {
//             filteredOffers = filteredOffers.filter(offer => {
//                 const price = offer.price.current;
//                 const meetsMinPrice = !priceRange.min || price >= priceRange.min;
//                 const meetsMaxPrice = !priceRange.max || price <= priceRange.max;
//                 return meetsMinPrice && meetsMaxPrice;
//             });
//         }

//         // Filter by amenities
//         if (amenities?.length) {
//             filteredOffers = filteredOffers.filter(offer =>
//                 amenities.every((amenity: any) => 
//                     offer.amenities.some(a => 
//                         a.toUpperCase().includes(amenity.toUpperCase())
//                     )
//                 )
//             );
//         }

//         // Filter by ratings
//         if (ratings?.length) {
//             filteredOffers = filteredOffers.filter(offer =>
//                 ratings.includes(Math.floor(offer.rating.overall).toString())
//             );
//         }

//         return NextResponse.json({
//             data: filteredOffers,
//             pagination: data.serpapi_pagination,
//             success: true,
//         });

//     } catch (error) {
//         console.error('Error in hotel-offers:', error);
//         return NextResponse.json(
//             {
//                 error: error instanceof Error ? error.message : 'Failed to fetch hotel offers',
//                 success: false,
//             },
//             { status: 500 }
//         );
//     }
// }


import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { HotelOffer } from "@/types";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
    noStore();
    try {
        // Example hotel offers for testing
        const exampleHotels: HotelOffer[] = [
            {
                propertyToken: "hotel-1",
                id: "hotel-1",
                type: "hotel",
                provider: "serp",
                name: "The Ritz-Carlton, Bali",
                description: "Zen-like quarters, some with butler service, in an upscale property offering refined dining & a spa.",
                location: {
                    latitude: -8.830671,
                    longitude: 115.215331,
                    address: "Jalan Raya Nusa Dua Selatan Lot III, Nusa Dua, Bali"
                },
                hotelClass: 5,
                checkIn: "15:00",
                checkOut: "12:00",
                amenities: [
                    "Free Wi-Fi",
                    "Free parking",
                    "Pools",
                    "Spa",
                    "Beach access",
                    "Restaurant",
                    "Room service",
                    "Fitness centre"
                ],
                images: [
                    {
                        thumbnail: "/hero.png",
                        original: "/hero.png",
                        alt: "Hotel exterior"
                    },
                    {
                        thumbnail: "/hero.png",
                        original: "/hero.png",
                        alt: "Pool view"
                    }
                ],
                price: {
                    current: 347,
                    original: 407,
                    currency: "USD",
                    beforeTaxes: 287,
                    includesTaxes: true,
                    discount: {
                        label: "Special Offer",
                        amount: 60,
                        percentage: 15
                    }
                },
                rating: {
                    overall: 4.6,
                    totalReviews: 3614,
                    location: 4.8,
                    breakdown: [
                        {
                            name: "Property",
                            description: "Property condition and facilities",
                            totalMentions: 605,
                            positive: 534,
                            negative: 44,
                            neutral: 27
                        },
                        {
                            name: "Service",
                            description: "Staff and service",
                            totalMentions: 599,
                            positive: 507,
                            negative: 74,
                            neutral: 18
                        }
                    ]
                },
                brand: {
                    name: "The Ritz-Carlton",
                    logo: "/hero.png"
                },
                nearbyPlaces: [
                    {
                        name: "Ngurah Rai International Airport",
                        transportations: [
                            {
                                type: "Taxi",
                                duration: "25 min"
                            }
                        ]
                    }
                ],
                refundable: true,
                sponsored: false
            },
            {
                propertyToken: "hotel-2",
                id: "hotel-2",
                type: "resort",
                provider: "serp",
                name: "Mulia Resort - Nusa Dua",
                description: "Upmarket rooms & suites in a premium beachfront getaway with 6 restaurants & 4 pools.",
                location: {
                    latitude: -8.81621,
                    longitude: 115.221174,
                    address: "Jl. Raya Nusa Dua Selatan, Nusa Dua, Bali"
                },
                hotelClass: 5,
                checkIn: "15:00",
                checkOut: "12:00",
                amenities: [
                    "Free breakfast",
                    "Free Wi-Fi",
                    "Multiple pools",
                    "Spa",
                    "Beach access",
                    "6 Restaurants",
                    "Room service",
                    "Fitness centre"
                ],
                images: [
                    {
                        thumbnail: "/hero.png",
                        original: "/hero.png",
                        alt: "Resort view"
                    },
                    {
                        thumbnail: "/hero.png",
                        original: "/hero.png",
                        alt: "Beach view"
                    }
                ],
                price: {
                    current: 484,
                    original: 550,
                    currency: "USD",
                    beforeTaxes: 388,
                    includesTaxes: true,
                    discount: {
                        label: "Last Minute Deal",
                        amount: 66,
                        percentage: 12
                    }
                },
                rating: {
                    overall: 4.7,
                    totalReviews: 7567,
                    location: 4.9,
                    breakdown: [
                        {
                            name: "Property",
                            description: "Property condition and facilities",
                            totalMentions: 1088,
                            positive: 971,
                            negative: 58,
                            neutral: 59
                        }
                    ]
                },
                brand: {
                    name: "Mulia",
                    logo: "/hero.png"
                },
                nearbyPlaces: [
                    {
                        name: "Ngurah Rai International Airport",
                        transportations: [
                            {
                                type: "Taxi",
                                duration: "20 min"
                            }
                        ]
                    }
                ],
                refundable: true,
                sponsored: true
            }
        ];

        return NextResponse.json({
            data: exampleHotels,
            pagination: {
                current_page: 1,
                total_pages: 1,
                has_more: false
            },
            success: true
        });

    } catch (error) {
        console.error('Error in hotel-offers:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to fetch hotel offers',
                success: false
            },
            { status: 500 }
        );
    }
}