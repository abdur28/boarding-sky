// import { NextResponse } from "next/server";
// import { unstable_noStore as noStore } from "next/cache";
// import { CarOffer } from "@/types";

// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

// const SKYSCANNER_API_KEY = process.env.SKYSCANNER_API_KEY;
// const BASE_URL = "https://partners.api.skyscanner.net/apiservices/v1/carhire/live/search";

// async function createSearch(params: any) {
//     const response = await fetch(`${BASE_URL}/create`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'api-key': SKYSCANNER_API_KEY!
//         },
//         body: JSON.stringify(params)
//     });

//     if (!response.ok) {
//         throw new Error(`Skyscanner search creation failed with status ${response.status}`);
//     }

//     return response.json();
// }

// async function pollResults(sessionToken: string) {
//     const response = await fetch(`${BASE_URL}/poll/${sessionToken}`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'api-key': SKYSCANNER_API_KEY!
//         }
//     });

//     if (!response.ok) {
//         throw new Error(`Skyscanner polling failed with status ${response.status}`);
//     }

//     return response.json();
// }

// async function pollUntilComplete(sessionToken: string, maxAttempts = 10, delayMs = 1000) {
//     let attempts = 0;
    
//     while (attempts < maxAttempts) {
//         const pollResponse = await pollResults(sessionToken);
        
//         if (pollResponse.status === 'completed') {
//             return pollResponse;
//         }
        
//         if (pollResponse.status === 'failed') {
//             throw new Error('Search failed');
//         }
        
//         await new Promise(resolve => setTimeout(resolve, delayMs));
//         attempts++;
//     }
    
//     throw new Error('Polling timeout');
// }

// export async function POST(req: Request) {
//     noStore();
//     try {
//         const {
//             pickUpLocation,
//             dropOffLocation,
//             pickUpDate,
//             dropOffDate,
//             driverAge = 30,
//             market = 'UK',
//             locale = 'en-GB',
//             currency = 'GBP',
//         } = await req.json();

//         // console.log(123, pickUpLocation, dropOffLocation, pickUpDate, dropOffDate, driverAge, market, locale, currency, userIp);

//         // Initial search creation
//         const createResponse = await createSearch({
//             market,
//             locale,
//             currency,
//             pickUpDate,
//             dropOffDate,
//             pickUpLocation,
//             dropOffLocation,
//             driverAge,
//         });

//         // Poll for complete results
//         const pollResponse = await pollUntilComplete(createResponse.sessionToken);

//         // Transform the response to match our CarOffer type
//         const carOffers: CarOffer[] = pollResponse.quotes.map((quote: any) => {
//             const vendor = pollResponse.vendors[quote.vendorId];
//             const agent = pollResponse.agents[quote.agentId];

//             return {
//                 id: quote.quoteId,
//                 provider: 'skyscanner',
//                 status: 'available',
                
//                 name: quote.vehicle.name,
//                 model: quote.vehicle.model,
//                 brand: quote.vehicle.brand,
//                 images: quote.vehicle.images.map((img: string) => ({
//                     url: img,
//                     alt: `${quote.vehicle.name} - ${quote.vehicle.brand}`
//                 })),
                
//                 features: {
//                     transmission: quote.vehicle.transmission.toLowerCase(),
//                     airConditioning: quote.vehicle.airConditioning,
//                     doors: quote.vehicle.doors,
//                     seats: quote.vehicle.seats,
//                     baggageCapacity: {
//                         large: quote.vehicle.baggageCapacity.large,
//                         small: quote.vehicle.baggageCapacity.small
//                     },
//                     category: quote.vehicle.category.toLowerCase(),
//                     fuelType: quote.vehicle.fuelType.toLowerCase(),
//                     fuelPolicy: quote.vehicle.fuelPolicy.toLowerCase()
//                 },
                
//                 pickupLocation: {
//                     id: pickUpLocation,
//                     name: quote.pickupLocation.name,
//                     type: quote.pickupLocation.type.toLowerCase(),
//                     address: quote.pickupLocation.address,
//                     coordinates: quote.pickupLocation.coordinates
//                 },
                
//                 dropoffLocation: {
//                     id: dropOffLocation || pickUpLocation,
//                     name: quote.dropoffLocation.name,
//                     type: quote.dropoffLocation.type.toLowerCase(),
//                     address: quote.dropoffLocation.address,
//                     coordinates: quote.dropoffLocation.coordinates
//                 },
                
//                 pickupDateTime: pickUpDate,
//                 dropoffDateTime: dropOffDate,
                
//                 price: {
//                     amount: quote.price.amount,
//                     currency: quote.price.currency,
//                     breakdown: quote.price.breakdown,
//                     includesTaxes: quote.price.includesTaxes,
//                     includesInsurance: quote.price.includesInsurance
//                 },
                
//                 insurance: quote.insurance.map((ins: any) => ({
//                     type: ins.type.toLowerCase(),
//                     coverage: ins.coverage,
//                     excess: ins.excess
//                 })),
                
//                 vendor: {
//                     id: vendor.id,
//                     name: vendor.name,
//                     logo: vendor.logo,
//                     rating: vendor.rating,
//                     reviewCount: vendor.reviewCount
//                 },
                
//                 agent: {
//                     id: agent.id,
//                     name: agent.name,
//                     logo: agent.logo,
//                     type: agent.type.toLowerCase(),
//                     rating: agent.rating,
//                     reviewCount: agent.reviewCount
//                 },
                
//                 mileage: quote.mileage,
//                 requiredDocuments: quote.requiredDocuments,
//                 restrictions: quote.restrictions,
//                 deepLink: quote.deepLink,
                
//                 meta: {
//                     skyscanner_session_token: createResponse.sessionToken,
//                     ...quote.meta
//                 }
//             };
//         });

//         return NextResponse.json({
//             offers: carOffers,
//             success: true,
//         });

//     } catch (error) {
//         console.error('Error in car-offers:', error);
//         return NextResponse.json(
//             {
//                 error: error instanceof Error ? error.message : 'Failed to fetch car offers',
//                 success: false,
//             },
//             { status: 500 }
//         );
//     }
// }

// app/api/skyscanner/car-offers/route.ts

import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { CarOffer } from "@/types";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const MOCK_CARS: CarOffer[] = [
    {
        id: "1",
        provider: 'skyscanner',
        status: 'available',
        name: "Toyota Camry",
        model: "Camry SE",
        brand: "Toyota",
        images: [
            {
                url: "https://images.unsplash.com/photo-1621007806519-67e7cec33011",
                alt: "Toyota Camry - Front View"
            },
            {
                url: "https://images.unsplash.com/photo-1621007806519-67e7cec33012",
                alt: "Toyota Camry - Side View"
            }
        ],
        features: {
            transmission: 'automatic',
            airConditioning: true,
            doors: 4,
            seats: 5,
            baggageCapacity: {
                large: 2,
                small: 1
            },
            category: 'standard',
            fuelType: 'petrol',
            fuelPolicy: 'full_to_full'
        },
        pickupLocation: {
            id: "LAX",
            name: "Los Angeles International Airport",
            type: "airport",
            address: "1 World Way, Los Angeles, CA 90045",
            coordinates: { latitude: 33.9416, longitude: -118.4085 }
        },
        dropoffLocation: {
            id: "LAX",
            name: "Los Angeles International Airport",
            type: "airport",
            address: "1 World Way, Los Angeles, CA 90045",
            coordinates: { latitude: 33.9416, longitude: -118.4085 }
        },
        pickupDateTime: "2024-02-20T10:00:00",
        dropoffDateTime: "2024-02-25T10:00:00",
        price: {
            amount: 299.99,
            currency: "USD",
            breakdown: {
                baseRate: 249.99,
                taxes: 30.00,
                fees: 20.00
            },
            includesTaxes: true,
            includesInsurance: true
        },
        insurance: [
            {
                type: "basic",
                coverage: {
                    collision: true,
                    theft: true,
                    thirdParty: true
                },
                excess: {
                    amount: 1000,
                    currency: "USD"
                }
            }
        ],
        vendor: {
            id: "hertz",
            name: "Hertz",
            logo: "https://example.com/hertz-logo.png",
            rating: 4.5,
            reviewCount: 1250
        },
        agent: {
            id: "hertz_agent",
            name: "Hertz Rentals",
            logo: "https://example.com/hertz-logo.png",
            type: "vendor",
            rating: 4.5,
            reviewCount: 1250
        },
        mileage: {
            limit: 1000,
            unlimited: false,
            unit: "miles"
        },
        requiredDocuments: ["drivers_license", "credit_card"],
        restrictions: {
            minAge: 21,
            maxAge: 75,
            minLicenseHeld: 1,
            requiredCreditCard: true
        },
        deepLink: "https://example.com/book/1",
        meta: {
            skyscanner_session_token: "mock_session_token"
        }
    },
    {
        id: "2",
        provider: 'skyscanner',
        status: 'available',
        name: "Tesla Model 3",
        model: "Model 3 Long Range",
        brand: "Tesla",
        images: [
            {
                url: "https://images.unsplash.com/photo-1621007806519-67e7cec33013",
                alt: "Tesla Model 3 - Front View"
            }
        ],
        features: {
            transmission: 'automatic',
            airConditioning: true,
            doors: 4,
            seats: 5,
            baggageCapacity: {
                large: 2,
                small: 2
            },
            category: 'luxury',
            fuelType: 'electric',
            fuelPolicy: 'full_to_full'
        },
        pickupLocation: {
            id: "LAX",
            name: "Los Angeles International Airport",
            type: "airport",
            address: "1 World Way, Los Angeles, CA 90045",
            coordinates: { latitude: 33.9416, longitude: -118.4085 }
        },
        dropoffLocation: {
            id: "LAX",
            name: "Los Angeles International Airport",
            type: "airport",
            address: "1 World Way, Los Angeles, CA 90045",
            coordinates: { latitude: 33.9416, longitude: -118.4085 }
        },
        pickupDateTime: "2024-02-20T10:00:00",
        dropoffDateTime: "2024-02-25T10:00:00",
        price: {
            amount: 499.99,
            currency: "USD",
            breakdown: {
                baseRate: 429.99,
                taxes: 40.00,
                fees: 30.00
            },
            includesTaxes: true,
            includesInsurance: true
        },
        insurance: [
            {
                type: "full",
                coverage: {
                    collision: true,
                    theft: true,
                    thirdParty: true,
                    personal: true
                },
                excess: {
                    amount: 500,
                    currency: "USD"
                }
            }
        ],
        vendor: {
            id: "enterprise",
            name: "Enterprise",
            logo: "https://example.com/enterprise-logo.png",
            rating: 4.7,
            reviewCount: 2300
        },
        agent: {
            id: "enterprise_agent",
            name: "Enterprise Rentals",
            logo: "https://example.com/enterprise-logo.png",
            type: "vendor",
            rating: 4.7,
            reviewCount: 2300
        },
        mileage: {
            unlimited: true,
            unit: "miles"
        },
        requiredDocuments: ["drivers_license", "credit_card"],
        restrictions: {
            minAge: 25,
            maxAge: 75,
            minLicenseHeld: 2,
            requiredCreditCard: true
        },
        deepLink: "https://example.com/book/2",
        meta: {
            skyscanner_session_token: "mock_session_token"
        }
    },
    // Add more mock cars here...
];

export async function POST(req: Request) {
    noStore();
    try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

        return NextResponse.json({
            offers: MOCK_CARS,
            success: true,
        });

    } catch (error) {
        console.error('Error in car-offers:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to fetch car offers',
                success: false,
            },
            { status: 500 }
        );
    }
}