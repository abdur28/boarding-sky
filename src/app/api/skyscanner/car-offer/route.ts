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
//             offerId,
//             pickUpLocation,
//             dropOffLocation,
//             pickUpDate,
//             dropOffDate,
//             pickUpTime,      // Added
//             dropOffTime,     // Added
//             driverAge = 30,
//             market = 'UK',
//             locale = 'en-GB',
//             currency = 'GBP',
//         } = await req.json();

//         if (!offerId) {
//             return NextResponse.json(
//                 {
//                     error: 'Offer ID is required',
//                     success: false,
//                 },
//                 { status: 400 }
//             );
//         }

//         // Combine date and time
//         const pickupDateTime = `${pickUpDate}T${pickUpTime}:00`;
//         const dropoffDateTime = `${dropOffDate}T${dropOffTime}:00`;

//         // Initial search creation
//         const createResponse = await createSearch({
//             market,
//             locale,
//             currency,
//             pickUpDate: pickupDateTime,      // Updated to include time
//             dropOffDate: dropoffDateTime,    // Updated to include time
//             pickUpLocation,
//             dropOffLocation,
//             driverAge,
//         });

//         // Poll for complete results
//         const pollResponse = await pollUntilComplete(createResponse.sessionToken);

//         // Find the specific offer
//         const quote = pollResponse.quotes.find((q: any) => q.quoteId === offerId);
        
//         if (!quote) {
//             return NextResponse.json(
//                 {
//                     error: 'Offer not found',
//                     success: false,
//                 },
//                 { status: 404 }
//             );
//         }

//         const vendor = pollResponse.vendors[quote.vendorId];
//         const agent = pollResponse.agents[quote.agentId];

//         // Transform the quote to match our CarOffer type
//         const carOffer: CarOffer = {
//             id: quote.quoteId,
//             provider: 'skyscanner',
//             status: 'available',
            
//             name: quote.vehicle.name,
//             model: quote.vehicle.model,
//             brand: quote.vehicle.brand,
//             images: quote.vehicle.images.map((img: string) => ({
//                 url: img,
//                 alt: `${quote.vehicle.name} - ${quote.vehicle.brand}`
//             })),
            
//             features: {
//                 transmission: quote.vehicle.transmission.toLowerCase(),
//                 airConditioning: quote.vehicle.airConditioning,
//                 doors: quote.vehicle.doors,
//                 seats: quote.vehicle.seats,
//                 baggageCapacity: {
//                     large: quote.vehicle.baggageCapacity.large,
//                     small: quote.vehicle.baggageCapacity.small
//                 },
//                 category: quote.vehicle.category.toLowerCase(),
//                 fuelType: quote.vehicle.fuelType.toLowerCase(),
//                 fuelPolicy: quote.vehicle.fuelPolicy.toLowerCase()
//             },
            
//             pickupLocation: {
//                 id: pickUpLocation,
//                 name: quote.pickupLocation.name,
//                 type: quote.pickupLocation.type.toLowerCase(),
//                 address: quote.pickupLocation.address,
//                 coordinates: quote.pickupLocation.coordinates
//             },
            
//             dropoffLocation: {
//                 id: dropOffLocation || pickUpLocation,
//                 name: quote.dropoffLocation.name,
//                 type: quote.dropoffLocation.type.toLowerCase(),
//                 address: quote.dropoffLocation.address,
//                 coordinates: quote.dropoffLocation.coordinates
//             },
            
//             pickupDateTime: pickupDateTime,    // Updated to include time
//             dropoffDateTime: dropoffDateTime,  // Updated to include time
            
//             price: {
//                 amount: quote.price.amount,
//                 currency: quote.price.currency,
//                 breakdown: quote.price.breakdown,
//                 includesTaxes: quote.price.includesTaxes,
//                 includesInsurance: quote.price.includesInsurance
//             },
            
//             insurance: quote.insurance.map((ins: any) => ({
//                 type: ins.type.toLowerCase(),
//                 coverage: ins.coverage,
//                 excess: ins.excess
//             })),
            
//             vendor: {
//                 id: vendor.id,
//                 name: vendor.name,
//                 logo: vendor.logo,
//                 rating: vendor.rating,
//                 reviewCount: vendor.reviewCount
//             },
            
//             agent: {
//                 id: agent.id,
//                 name: agent.name,
//                 logo: agent.logo,
//                 type: agent.type.toLowerCase(),
//                 rating: agent.rating,
//                 reviewCount: agent.reviewCount
//             },
            
//             mileage: quote.mileage,
//             requiredDocuments: quote.requiredDocuments,
//             restrictions: quote.restrictions,
//             deepLink: quote.deepLink,
            
//             meta: {
//                 skyscanner_session_token: createResponse.sessionToken,
//                 ...quote.meta
//             }
//         };

//         return NextResponse.json({
//             offer: carOffer,
//             success: true,
//         });

//     } catch (error) {
//         console.error('Error in car-offer:', error);
//         return NextResponse.json(
//             {
//                 error: error instanceof Error ? error.message : 'Failed to fetch car offer',
//                 success: false,
//             },
//             { status: 500 }
//         );
//     }
// }

import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { CarOffer } from "@/types";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Mock data for testing
const mockCarOffer = (
    offerId: string,
    pickUpLocation: string,
    dropOffLocation: string,
    pickUpDate: string,
    dropOffDate: string
): CarOffer => ({
    id: offerId,
    provider: 'skyscanner',
    status: 'available',
    
    name: 'Toyota Camry',
    model: 'Camry',
    brand: 'Toyota',
    images: [
        {
            url: 'https://example.com/camry1.jpg',
            alt: 'Toyota Camry - Front View'
        },
        {
            url: 'https://example.com/camry2.jpg',
            alt: 'Toyota Camry - Side View'
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
        category: 'intermediate',
        fuelType: 'petrol',
        fuelPolicy: 'full_to_full'
    },
    
    pickupLocation: {
        id: pickUpLocation,
        name: 'Heathrow Airport Terminal 5',
        type: 'airport',
        address: 'Heathrow Airport, Longford TW6 2GA',
        coordinates: {
            latitude: 51.4700,
            longitude: -0.4543
        }
    },
    
    dropoffLocation: {
        id: dropOffLocation || pickUpLocation,
        name: 'Heathrow Airport Terminal 5',
        type: 'airport',
        address: 'Heathrow Airport, Longford TW6 2GA',
        coordinates: {
            latitude: 51.4700,
            longitude: -0.4543
        }
    },
    
    pickupDateTime: pickUpDate,
    dropoffDateTime: dropOffDate,
    
    price: {
        amount: 45.99,
        currency: 'GBP',
        breakdown: {
            baseRate: 35.99,
            taxes: 5.00,
            fees: 5.00,
            insurance: 0,
            extras: 0
        },
        includesTaxes: true,
        includesInsurance: false
    },
    
    insurance: [
        {
            type: 'basic',
            coverage: {
                collision: true,
                theft: true,
                thirdParty: true,
                personal: false
            },
            excess: {
                amount: 1000,
                currency: 'GBP'
            }
        },
        {
            type: 'full',
            coverage: {
                collision: true,
                theft: true,
                thirdParty: true,
                personal: true
            },
            excess: {
                amount: 0,
                currency: 'GBP'
            }
        }
    ],
    
    vendor: {
        id: 'hertz',
        name: 'Hertz',
        logo: 'https://example.com/hertz-logo.png',
        rating: 4.5,
        reviewCount: 1250
    },
    
    agent: {
        id: 'hertz_direct',
        name: 'Hertz',
        logo: 'https://example.com/hertz-logo.png',
        type: 'vendor',
        rating: 4.5,
        reviewCount: 1250
    },
    
    mileage: {
        limit: 1000,
        unlimited: false,
        unit: 'miles'
    },
    
    requiredDocuments: [
        'Valid driving license',
        'Credit card',
        'Passport or ID'
    ],
    
    restrictions: {
        minAge: 21,
        maxAge: 75,
        minLicenseHeld: 2,
        requiredCreditCard: true
    },
    
    deepLink: 'https://www.skyscanner.net/car-hire/bookings/example',
    
    meta: {
        skyscanner_session_token: 'mock_session_token_123',
    }
});

export async function POST(req: Request) {
    noStore();
    try {
        const {
            offerId,
            pickUpLocation,
            dropOffLocation,
            pickUpDate,
            dropOffDate,
        } = await req.json();

        if (!offerId) {
            return NextResponse.json(
                {
                    error: 'Offer ID is required',
                    success: false,
                },
                { status: 400 }
            );
        }

        // Generate mock offer data
        const carOffer = mockCarOffer(
            offerId,
            pickUpLocation,
            dropOffLocation || pickUpLocation,
            pickUpDate,
            dropOffDate
        );

        // Simulate a short delay to mimic API latency
        await new Promise(resolve => setTimeout(resolve, 500));

        return NextResponse.json({
            data: carOffer,
            success: true,
        });

    } catch (error) {
        console.error('Error in car-offer:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to fetch car offer',
                success: false,
            },
            { status: 500 }
        );
    }
}