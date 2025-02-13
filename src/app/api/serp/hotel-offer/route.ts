// app/api/[providerId]/hotel-offers/route.ts
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { HotelOffer } from "@/types";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SERP_API_KEY = process.env.SERP_API_KEY;
const BASE_URL = "https://serpapi.com/search.json";

export async function POST(req: Request, { params }: { params: { providerId: string } }) {
    noStore();
    const EXAMPLE_HOTELS: HotelOffer[] = [
        {
            id: "hotel_1",
            type: "hotel",
            name: "Hilton Bali Resort",
            description: "This sprawling, upscale resort on a lush cliff is 3 km from Geger Beach and 15 km from Garuda Wisnu Kencana.",
            location: {
                latitude: -8.8256848,
                longitude: 115.21867449999999,
                address: "Jl. Raya Nusa Dua Selatan, Benoa, Kec. Kuta Sel., Kabupaten Badung, Bali 80361, Indonesia",
            },
            hotelClass: 5,
            checkIn: "3:00 PM",
            checkOut: "12:00 PM",
            amenities: [
                "Free Wi-Fi",
                "Free parking",
                "Pools",
                "Hot tub",
                "Air conditioning",
                "Fitness centre",
                "Spa",
                "Beach access",
                "Bar",
                "Restaurant",
            ],
            images: [
                {
                    thumbnail: "/hero.png",
                    original: "/hero.png",
                },
                {
                    thumbnail: "/hero.png",
                    original: "/hero.png",
                },
            ],
            price: {
                current: 203,
                original: 219,
                currency: "USD",
                beforeTaxes: 168,
                includesTaxes: true,
                discount: {
                    label: "Member rate, save 15%",
                    amount: 16,
                }
            },
            rating: {
                overall: 4.6,
                totalReviews: 3614,
                location: 4.2,
                breakdown: [
                    {
                        name: "Property",
                        description: "Property",
                        totalMentions: 605,
                        positive: 534,
                        negative: 44,
                        neutral: 27,
                    },
                    {
                        name: "Service",
                        description: "Service",
                        totalMentions: 599,
                        positive: 507,
                        negative: 74,
                        neutral: 18,
                    },
                ]
            },
            brand: {
                name: "Hilton",
                logo: "/hero.png",
            },
            nearbyPlaces: [
                {
                    name: "Nusa Dua Beach",
                    category: "Beach",
                    transportations: [
                        {
                            type: "Walking",
                            duration: "10 min"
                        }
                    ],
                    rating: 4.5,
                    reviews: 1200,
                }
            ],
            meta: {
                sustainabilityInfo: {
                    ecoCertified: true,
                },
                lastUpdated: new Date().toISOString(),
                typicalPriceRange: {
                    min: 180,
                    max: 300,
                },
                deal: {
                    type: "Limited time offer",
                    description: "Save 15% with member rate"
                }
            }
        },
        {
            id: "hotel_2",
            type: "hotel",
            name: "The Ritz-Carlton Bali",
            description: "Zen-like quarters, some with butler service, in an upscale property offering refined dining & a spa.",
            location: {
                latitude: -8.830671,
                longitude: 115.215331,
                address: "Jl. Raya Nusa Dua Selatan Lot III, Sawangan, Nusa Dua, Bali 80363, Indonesia",
            },
            hotelClass: 5,
            checkIn: "3:00 PM",
            checkOut: "12:00 PM",
            amenities: [
                "Free Wi-Fi",
                "Pools",
                "Spa",
                "Beach access",
                "Room service",
                "Butler service",
                "Multiple restaurants",
            ],
            images: [
                {
                    thumbnail: "/hero.png",
                    original: "/hero.png",
                },
                {
                    thumbnail: "/hero.png",
                    original: "/hero.png",
                },
            ],
            price: {
                current: 347,
                currency: "USD",
                beforeTaxes: 287,
                includesTaxes: true,
            },
            rating: {
                overall: 4.8,
                totalReviews: 2854,
                location: 4.5,
                breakdown: [
                    {
                        name: "Property",
                        description: "Property",
                        totalMentions: 405,
                        positive: 384,
                        negative: 12,
                        neutral: 9,
                    }
                ]
            },
            brand: {
                name: "Ritz-Carlton",
                logo: "/hero.png",
            },
            meta: {
                lastUpdated: new Date().toISOString(),
                typicalPriceRange: {
                    min: 300,
                    max: 500,
                }
            }
        }
    ];

    return NextResponse.json({data: EXAMPLE_HOTELS});
    
    // try {
    //     const { providerId } = params;
    //     const {
    //         city,
    //         checkIn,
    //         checkOut,
    //         adults = 2,
    //         children = 0,
    //         rooms = 1,
    //         priceRange,
    //         amenities,
    //         ratings,
    //         currency = "USD",
    //         propertyId
    //     } = await req.json();

    //     switch (providerId) {
    //         case 'serp': {
    //             // Construct query parameters for SerpAPI
    //             const searchParams = new URLSearchParams({
    //                 engine: "google_hotels",
    //                 q: `${city} Hotels`,
    //                 check_in_date: checkIn,
    //                 check_out_date: checkOut,
    //                 adults: adults.toString(),
    //                 currency: currency,
    //                 gl: "us",
    //                 hl: "en",
    //                 api_key: SERP_API_KEY!,
    //             });

    //             if (children > 0) {
    //                 searchParams.append("children", children.toString());
    //             }

    //             if (propertyId) {
    //                 searchParams.append("property_token", propertyId);
    //             }

    //             const response = await fetch(`${BASE_URL}?${searchParams.toString()}`);

    //             if (!response.ok) {
    //                 throw new Error(`SerpAPI request failed with status ${response.status}`);
    //             }

    //             const data = await response.json();
                
    //             // Transform properties to our HotelOffer format
    //             const transformedOffers: HotelOffer[] = propertyId 
    //                 ? [transformSerpApiPropertyToHotelOffer(data)]
    //                 : data.properties.map(transformSerpApiPropertyToHotelOffer);

    //             // Apply additional filters if provided
    //             let filteredOffers = transformedOffers;

    //             if (priceRange?.min || priceRange?.max) {
    //                 filteredOffers = filteredOffers.filter(offer => {
    //                     const price = offer.price.current;
    //                     const meetsMinPrice = !priceRange.min || price >= priceRange.min;
    //                     const meetsMaxPrice = !priceRange.max || price <= priceRange.max;
    //                     return meetsMinPrice && meetsMaxPrice;
    //                 });
    //             }

    //             if (amenities?.length) {
    //                 filteredOffers = filteredOffers.filter(offer =>
    //                     amenities.every(amenity => 
    //                         offer.amenities.some(a => 
    //                             a.toUpperCase().includes(amenity.toUpperCase())
    //                         )
    //                     )
    //                 );
    //             }

    //             if (ratings?.length) {
    //                 filteredOffers = filteredOffers.filter(offer =>
    //                     ratings.includes(offer.hotelClass?.toString())
    //                 );
    //             }

    //             return NextResponse.json({
    //                 data: filteredOffers,
    //                 pagination: data.serpapi_pagination,
    //                 success: true,
    //             });
    //         }

    //         default:
    //             throw new Error(`Unsupported provider: ${providerId}`);
    //     }

    // } catch (error) {
    //     console.error('Error in hotel-offers:', error);
    //     return NextResponse.json(
    //         {
    //             error: error instanceof Error ? error.message : 'Failed to fetch hotel offers',
    //             success: false,
    //         },
    //         { status: 500 }
    //     );
    // }
}

function transformSerpApiPropertyToHotelOffer(property: any): HotelOffer {
    return {
        id: property.property_token || String(Math.random()),
        type: property.type || 'hotel',
        name: property.name,
        description: property.description,
        location: {
            latitude: property.gps_coordinates.latitude,
            longitude: property.gps_coordinates.longitude,
            address: property.address,
        },
        hotelClass: property.extracted_hotel_class,
        checkIn: property.check_in_time,
        checkOut: property.check_out_time,
        amenities: property.amenities || [],
        images: property.images.map((img: any) => ({
            thumbnail: img.thumbnail,
            original: img.original_image,
        })),
        price: {
            current: property.rate_per_night.extracted_lowest,
            original: property.prices?.[0]?.original_rate_per_night?.extracted_lowest,
            currency: property.prices?.[0]?.currency || 'USD',
            beforeTaxes: property.rate_per_night.extracted_before_taxes_fees,
            includesTaxes: true,
            ...(property.prices?.[0]?.discount_remarks && {
                discount: {
                    label: property.prices[0].discount_remarks[0],
                    amount: property.prices[0].original_rate_per_night.extracted_lowest - 
                           property.prices[0].rate_per_night.extracted_lowest,
                }
            })
        },
        rating: {
            overall: property.overall_rating,
            totalReviews: property.reviews,
            location: property.location_rating,
            breakdown: property.reviews_breakdown?.map((rb: any) => ({
                name: rb.name,
                description: rb.description,
                totalMentions: rb.total_mentioned,
                positive: rb.positive,
                negative: rb.negative,
                neutral: rb.neutral,
            }))
        },
        brand: property.logo ? {
            name: property.name,
            logo: property.logo,
        } : undefined,
        nearbyPlaces: property.nearby_places?.map((place: any) => ({
            name: place.name,
            category: place.category,
            transportations: place.transportations,
            rating: place.rating,
            reviews: place.reviews,
        })),
        meta: {
            sustainabilityInfo: {
                ecoCertified: property.eco_certified || false,
            },
            lastUpdated: new Date().toISOString(),
            typicalPriceRange: property.typical_price_range,
            ...(property.deal && {
                deal: {
                    type: property.deal,
                    description: property.deal_description
                }
            })
        }
    };
}