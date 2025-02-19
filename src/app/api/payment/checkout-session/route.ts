// app/api/create-checkout-session/route.ts
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { CarOffer, FlightOffer, HotelOffer } from "@/types";
import { getUser } from "@/lib/data";


export const dynamic = 'force-dynamic';
export const revalidate = 0;

type BookingType = 'car' | 'flight' | 'hotel' | 'tour';

interface BaseBookingDetails {
  email: string;
  phone: string;
  firstName: string;
  middleName?: string;
  lastName: string;
}

interface CarBookingDetails extends BaseBookingDetails {
  pickupDate: string;
  dropoffDate: string;
  pickupTime: string;
  dropoffTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  licenseNumber: string;
  dateOfBirth: string;
}

interface FlightBookingDetails extends BaseBookingDetails {
  meta: {
    lastTicketingDate?: string;
    numberOfBookableSeats?: number;
    validatingCarrier: string;
  }
  addProtection: boolean;
  passengerDetails: Array<{
    type: 'adult' | 'child' | 'infant';
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    passportNumber?: string;
    specialRequests?: string[];
  }>;
}

interface HotelBookingDetails extends BaseBookingDetails {
    checkIn: string;
    checkOut: string;
    rooms: number;
    guests: Array<{
        firstName: string;
        lastName: string;
        age?: number;
    }>;
    specialRequests: string;
    roomDetails: {
        id: string;
        name: string;
        price: {
            amount: number;
            currency: string;
            breakdown?: {
                baseRate: number;
                taxes: number;
                fees: number;
            };
        };
        maxOccupancy: number;
    };
}

interface TourBookingDetails extends BaseBookingDetails {
    totalParticipants: number;
    adults: number;
    children: number;
    departure: string;
    agreeToTerms: boolean;
}

interface TourOffer {
    id: string;
    name: string;
    tourId: string;
    destination: string;
    days: number;
    departure: string;
    price: {
        amount: number;
        currency: string;
    };
    provider: string;
}

export async function POST(req: Request) {
    noStore();
    try {
        const user = await getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { 
            bookingType,
            offer, 
            price,
            bookingDetails,
            provider,
            addProtection
        }: {
            bookingType: BookingType;
            price: number;
            offer: CarOffer | FlightOffer | HotelOffer | TourOffer; 
            bookingDetails: CarBookingDetails | FlightBookingDetails | HotelBookingDetails | TourBookingDetails;
            provider: string;
            addProtection: boolean;
        } = body;

        // Validate required fields
        if (!bookingType || !offer || !bookingDetails) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        let lineItem;
        let metadata: Record<string, any> = {
            bookingType,
            offerId: offer.id,
            provider,
            userId: user._id.toString(),
            customerEmail: bookingDetails.email,
            customerPhone: bookingDetails.phone,
            customerName: bookingDetails.middleName && bookingDetails.middleName !== '' ?
             `${bookingDetails.firstName} ${bookingDetails.middleName} ${bookingDetails.lastName}` : 
             `${bookingDetails.firstName} ${bookingDetails.lastName}`,
        };

        switch (bookingType) {
            case 'car':
                const carDetails = bookingDetails as CarBookingDetails;
                lineItem = {
                    price_data: {
                        currency: offer.price.currency.toLowerCase(),
                        product_data: {
                            name: `Car Rental - ${(offer as CarOffer).name}`,
                            description: `${carDetails.pickupDate} to ${carDetails.dropoffDate}`,
                        },
                        unit_amount: Math.round(price * 100),
                    },
                    quantity: 1,
                };
                metadata.actualAmount = Math.round((offer as CarOffer).price.amount * 100);
                metadata.car = JSON.stringify({
                    pickupDate: carDetails.pickupDate,
                    dropoffDate: carDetails.dropoffDate,
                    pickupTime: carDetails.pickupTime,
                    dropoffTime: carDetails.dropoffTime,
                    pickupLocation: carDetails.pickupLocation,
                    dropoffLocation: carDetails.dropoffLocation,
                    licenseNumber: carDetails.licenseNumber,
                    dateOfBirth: carDetails.dateOfBirth,
                });
                break;

                case 'flight':
                    const flightOffer = offer as FlightOffer;
                    const flightDetails = bookingDetails as FlightBookingDetails;
                    lineItem = {
                        price_data: {
                            currency: flightOffer.price.currency.toLowerCase(),
                            product_data: {
                                name: `Flight ${flightOffer.meta.validatingCarrier}`,
                                description: formatFlightDescription(flightOffer),
                            },
                            unit_amount: Math.round(price * 100),
                        },
                        quantity: 1,
                    };

                    // Add flight metadata
                    metadata.actualAmount = Math.round(flightOffer.price.amount * 100);
                    metadata.flight_meta = JSON.stringify(flightOffer.meta);
                    metadata.flight_source = flightOffer.source || 'OTHER';
                    metadata.flight_passengers = JSON.stringify(flightDetails.passengerDetails);
                    metadata.flight_addProtection = addProtection.toString();
                    
                    // Store itineraries count for reconstruction
                    metadata.flight_itineraries_count = flightOffer.itineraries.length.toString();
                    
                    // Store segments for each itinerary
                    flightOffer.itineraries.forEach((itinerary, itineraryIndex) => {
                        // Store segments count for this itinerary
                        metadata[`flight_itinerary_${itineraryIndex}_segments_count`] = 
                            itinerary.segments.length.toString();
                        
                        // Store each segment
                        itinerary.segments.forEach((segment, segmentIndex) => {
                            const segmentKey = `flight_itinerary_${itineraryIndex}_segment_${segmentIndex}`;
                            metadata[segmentKey] = JSON.stringify({
                                departure: segment.departure,
                                arrival: segment.arrival,
                                carrierCode: segment.carrierCode,
                                number: segment.number,
                                aircraft: segment.aircraft,
                                duration: segment.duration,
                                stops: segment.stops || []
                            });
                        });
                    });
                    break;

                case 'hotel':
                    const hotelOffer = offer as HotelOffer;
                    const hotelDetails = bookingDetails as HotelBookingDetails;
                    lineItem = {
                        price_data: {
                            currency: hotelOffer.price.currency.toLowerCase(),
                            product_data: {
                                name: `${hotelOffer.name} - ${hotelDetails.roomDetails.name}`,
                                description: `${hotelDetails.checkIn} to ${hotelDetails.checkOut}`,
                            },
                            unit_amount: Math.round(price * 100),
                        },
                        quantity: 1,
                    };
                    metadata.actualAmount = Math.round(hotelDetails.roomDetails.price.amount * 100);
                    metadata.hotel = JSON.stringify({
                        checkIn: hotelDetails.checkIn,
                        checkOut: hotelDetails.checkOut,
                        rooms: hotelDetails.rooms,
                        guests: hotelDetails.guests,
                        specialRequests: hotelDetails.specialRequests,
                        roomDetails: hotelDetails.roomDetails
                    });
                    break;

                case 'tour':
                    const tourOffer = offer as TourOffer;
                    const tourDetails = bookingDetails as TourBookingDetails;
                    lineItem = {
                        price_data: {
                            currency: tourOffer.price.currency.toLowerCase(),
                            product_data: {
                                name: `Tour - ${tourOffer.name}`,
                                description: `${tourOffer.destination} - ${tourOffer.days} days, Departure: ${tourDetails.departure}`,
                            },
                            unit_amount: Math.round(price * 100),
                        },
                        quantity: 1,
                    };
                    metadata.actualAmount = Math.round(tourOffer.price.amount * 100);
                    metadata.tour = JSON.stringify({
                        tourId: tourOffer.tourId,
                        destination: tourOffer.destination,
                        days: tourOffer.days,
                        departure: tourDetails.departure,
                        totalParticipants: tourDetails.totalParticipants,
                        adults: tourDetails.adults,
                        children: tourDetails.children
                    });
                    break;

            default:
                throw new Error('Invalid booking type');
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [lineItem],
            metadata,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Error in create-checkout-session:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}

function formatFlightDescription(offer: FlightOffer): string {
    const firstSegment = offer.itineraries[0].segments[0];
    const lastSegment = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];
    return `${firstSegment.departure.iataCode} to ${lastSegment.arrival.iataCode}`;
}

function formatItinerary(itinerary: any) {
    return {
        duration: itinerary.duration,
        segments: itinerary.segments.map((segment: any) => ({
            departure: segment.departure,
            arrival: segment.arrival,
            flightNumber: `${segment.carrierCode}${segment.number}`,
        })),
    };
}