// app/api/amadeus/flight-offer/route.ts
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { FareDetail, FlightOffer, FlightSegment, Itinerary } from "@/types";

export const revalidate = 0;
export const dynamic = 'force-dynamic'

export const POST = async (req: Request) => {
    noStore();
    const { 
        token, 
        offerId,
        origin,
        destination,
        departureDate,
        returnDate,
        adults,
        children = 0,
        infants = 0,
        travelClass
    } = await req.json();

    if (!token || !offerId || !origin || !destination || !departureDate || !adults) {
        return NextResponse.json(
            { 
                error: 'Missing required parameters',
                success: false 
            },
            { status: 400 }
        );
    }

    try {
        // Build the search URL with parameters
        const searchUrl = new URL('https://test.api.amadeus.com/v2/shopping/flight-offers');
        searchUrl.searchParams.append('originLocationCode', origin);
        searchUrl.searchParams.append('destinationLocationCode', destination);
        searchUrl.searchParams.append('departureDate', departureDate);
        searchUrl.searchParams.append('adults', adults.toString());
        searchUrl.searchParams.append('currencyCode', 'USD');
        searchUrl.searchParams.append('max', '100');

        if (returnDate) searchUrl.searchParams.append('returnDate', returnDate);
        if (children > 0) searchUrl.searchParams.append('children', children.toString());
        if (infants > 0) searchUrl.searchParams.append('infants', infants.toString());
        if (travelClass) searchUrl.searchParams.append('travelClass', travelClass);

        const response = await fetch(searchUrl.toString(), {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        const rawData = await response.json();

        if (!response.ok) {
            throw new Error(rawData.errors?.[0]?.detail || 'Failed to fetch flight offers');
        }

        // Find the specific offer by ID
        const offer = rawData.data.find((o: any) => o.id === offerId);
        
        if (!offer) {
            return NextResponse.json(
                { 
                    error: 'Flight offer not found',
                    success: false 
                },
                { status: 404 }
            );
        }

        // Transform the single offer using the same transformation logic
        const transformedOffer: FlightOffer = {
            id: offer.id,
            providerId: 'amadeus',
            passengers: {
                adults,
                children: children || 0,
                infants: infants || 0
            },
            travelClass,
            source: offer.source,
            price: {
                amount: parseFloat(offer.price.grandTotal),
                currency: offer.price.currency,
                breakdown: {
                    base: parseFloat(offer.price.base),
                    taxes: parseFloat(offer.price.total) - parseFloat(offer.price.base),
                    fees: offer.price.fees.reduce((sum: number, fee: any) => 
                        sum + parseFloat(fee.amount), 0)
                }
            },
            itineraries: offer.itineraries.map((itinerary: any): Itinerary => ({
                duration: itinerary.duration,
                segments: itinerary.segments.map((segment: any): FlightSegment => ({
                    departure: {
                        iataCode: segment.departure.iataCode,
                        terminal: segment.departure.terminal,
                        at: segment.departure.at
                    },
                    arrival: {
                        iataCode: segment.arrival.iataCode,
                        terminal: segment.arrival.terminal,
                        at: segment.arrival.at
                    },
                    duration: segment.duration,
                    carrierCode: segment.carrierCode,
                    number: segment.number,
                    aircraft: {
                        code: segment.aircraft.code,
                        name: rawData.dictionaries.aircraft[segment.aircraft.code]
                    },
                    operating: segment.operating ? {
                        carrierCode: segment.operating.carrierCode,
                        number: segment.operating.number
                    } : undefined,
                    stops: segment.stops || []
                }))
            })),
            fareDetails: offer.travelerPricings[0].fareDetailsBySegment.map((detail: any): FareDetail => ({
                cabin: detail.cabin,
                class: detail.class,
                fareBasis: detail.fareBasis,
                baggage: {
                    checked: detail.includedCheckedBags ? {
                        quantity: detail.includedCheckedBags.quantity || 1,
                        weight: detail.includedCheckedBags.weight,
                        weightUnit: detail.includedCheckedBags.weightUnit
                    } : undefined,
                    cabin: {
                        quantity: 1,
                    }
                }
            })),
            meta: {
                lastTicketingDate: offer.lastTicketingDate,
                numberOfBookableSeats: offer.numberOfBookableSeats,
                validatingCarrier: offer.validatingAirlineCodes[0]
            },
            dictionaries: {
                carriers: rawData.dictionaries.carriers,
                aircraft: rawData.dictionaries.aircraft,
                locations: rawData.dictionaries.locations
            }
        };

        return NextResponse.json({
            data: transformedOffer,
            success: true
        });

    } catch (error) {
        console.error('Error in flight-offer:', error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Failed to fetch flight offer',
                success: false 
            },
            { status: 500 }
        );
    }
}