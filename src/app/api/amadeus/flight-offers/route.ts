import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { FareDetail, FlightOffer, FlightSegment, Itinerary } from "@/types";

export const revalidate = 0;
export const dynamic = 'force-dynamic'

export const POST = async (req: Request) => {
    noStore();
    const { token, origin, destination, adults, travelClass, departureDate, returnDate, children, infants } = await req.json();

    try {
        const response = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&travelClass=${travelClass}&departureDate=${departureDate}${returnDate ? `&returnDate=${returnDate}`: ``}&adults=${adults}${children > 0 ? `&children=${children}`: ``}${infants > 0 ? `&infants=${infants}`: ``}&currencyCode=USD&nonStop=false&max=100`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        const rawData = await response.json();

        if (!response.ok) {
            throw new Error(rawData.errors?.[0]?.detail || 'Failed to fetch flight offers');
        }

        const transformedData = rawData.data.map((offer: any): FlightOffer => ({
                id: offer.id,
                providerId: 'amadeus',
                source: offer.source,
                passengers: {
                    adults,
                    children: children || 0,
                    infants: infants || 0
                },
                travelClass,
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
                            quantity: 1,
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
        }))
        return NextResponse.json({data:transformedData});

    } catch (error) {
        console.error('Error in flight-offers:', error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Failed to fetch flight offers',
                success: false 
            },
            { status: 500 }
        );
    }
}