import { stripe } from "@/lib/stripe";
import client from "@/lib/mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import mongoose from "mongoose";

type BookingType = 'car' | 'flight' | 'hotel' | 'tour';
type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

interface CustomerDetails {
    name: string;
    email: string;
    phone: string;
}

interface UserDetails {
    _id: string;
    name: string;
    email: string;
    profilePicture: string;
}

interface BaseBooking {
    bookingId: string;
    stripeSessionId: string;
    bookingType: BookingType;
    provider: string;
    user: UserDetails;
    customer: CustomerDetails;
    paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
    amount: number;
    actualAmount: number;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
    status: BookingStatus;
}

interface Receipt {
    receiptId: string;
    bookingId: string;
    bookingType: BookingType;
    transactionDate: Date;
    customer: CustomerDetails;
    user: UserDetails;
    paymentDetails: {
        amount: number;
        actualAmount: number;
        currency: string;
        paymentMethod: string;
        transactionId: string;
    };
    itemDetails: {
        name: string;
        description: string;
        quantity: number;
        unitPrice: number;
        protection?: {
            included: boolean;
            amount: number;
        };
    };
    provider: string;
    status: 'paid' | 'refunded' | 'failed';
}

async function getUserDetails(userId: string): Promise<UserDetails | null> {
    const mongoClient = await client;
    const db = mongoClient.db("boarding-sky");
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { 
            projection: {
                firstName: 1,
                lastName: 1,
                email: 1,
                profilePicture: 1
            }
        }
    );

    if (!user) return null;

    return {
        _id: user._id.toString(),
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        profilePicture: user.profilePicture
    };
}

async function getLineItems(sessionId: string) {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items']
    });
    return session.line_items?.data;
}

function reconstructFlightDetails(metadata: Record<string, any>) {
    const itinerariesCount = parseInt(metadata.flight_itineraries_count || '0');
    const itineraries = [];

    for (let i = 0; i < itinerariesCount; i++) {
        const segmentsCount = parseInt(metadata[`flight_itinerary_${i}_segments_count`] || '0');
        const segments = [];

        for (let j = 0; j < segmentsCount; j++) {
            const segmentKey = `flight_itinerary_${i}_segment_${j}`;
            if (metadata[segmentKey]) {
                segments.push(JSON.parse(metadata[segmentKey]));
            }
        }

        if (segments.length > 0) {
            itineraries.push({ segments });
        }
    }

    return {
        meta: JSON.parse(metadata.flight_meta || '{}'),
        source: metadata.flight_source || 'OTHER',
        addProtection: JSON.parse(metadata.flight_addProtection || 'false'),
        itineraries,
        passengers: JSON.parse(metadata.flight_passengers || '[]')
    };
}

function reconstructTourDetails(metadata: Record<string, any>) {
    const tourData = JSON.parse(metadata.tour || '{}');
    return {
        tourId: tourData.tourId,
        destination: tourData.destination,
        days: tourData.days,
        departure: tourData.departure,
        totalParticipants: tourData.totalParticipants,
        adults: tourData.adults,
        children: tourData.children
    };
}

function getBookingDescription(session: any, bookingType: BookingType): string {
    switch (bookingType) {
        case 'flight':
            const flightMeta = JSON.parse(session.metadata?.flight_meta || '{}');
            return `Flight ${flightMeta.validatingCarrier}`;
        case 'hotel':
            const hotelDetails = JSON.parse(session.metadata?.hotel || '{}');
            return `${hotelDetails.checkIn} to ${hotelDetails.checkOut}`;
        case 'car':
            const carDetails = JSON.parse(session.metadata?.car || '{}');
            return `${carDetails.pickupDate} to ${carDetails.dropoffDate}`;
        case 'tour':
            const tourDetails = JSON.parse(session.metadata?.tour || '{}');
            return `${tourDetails.destination} - ${tourDetails.days} days, Departure: ${tourDetails.departure}`;
        default:
            return 'Booking';
    }
}

async function createReceipt(
    session: any, 
    bookingId: string, 
    bookingType: BookingType,
    userDetails: UserDetails,
    customerDetails: CustomerDetails
): Promise<Receipt> {
    const lineItems = await getLineItems(session.id);
    const protection = bookingType === 'flight' ? 
        JSON.parse(session.metadata?.flight_addProtection || 'false') : false;
    
    const actualAmount = parseFloat(session.metadata?.actualAmount || '0') / 100;
    const totalAmount = session.amount_total / 100;
    const protectionAmount = protection ? totalAmount - actualAmount : 0;

    const receipt: Receipt = {
        receiptId: `RCP-${randomUUID().split('-')[0].toUpperCase()}`,
        bookingId,
        bookingType,
        transactionDate: new Date(session.created * 1000),
        customer: customerDetails,
        user: userDetails,
        paymentDetails: {
            amount: totalAmount,
            actualAmount,
            currency: session.currency,
            paymentMethod: session.payment_method_types[0],
            transactionId: session.payment_intent,
        },
        itemDetails: {
            name: lineItems?.[0]?.description || 'Booking',
            description: getBookingDescription(session, bookingType),
            quantity: 1,
            unitPrice: actualAmount,
            ...(protection && {
                protection: {
                    included: true,
                    amount: protectionAmount
                }
            })
        },
        provider: session.metadata?.provider || 'direct',
        status: 'paid'
    };

    return receipt;
}

async function handleDatabaseOperation(operation: () => Promise<any>) {
    try {
        return await operation();
    } catch (error) {
        console.error('Database operation failed:', error);
        throw new Error(error instanceof Error ? error.message : 'Database operation failed');
    }
}

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        console.error('Missing required configuration');
        return NextResponse.json(
            { error: 'Configuration error' },
            { status: 400 }
        );
    }

    try {
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            
            try {
                const mongoClient = await client;
                const db = mongoClient.db("boarding-sky");
                const mongoSession = mongoClient.startSession();
                
                try {
                    const result = await handleDatabaseOperation(async () => {
                        return await mongoSession.withTransaction(async () => {
                            const bookingType = session.metadata?.bookingType as BookingType;
                            if (!bookingType) {
                                throw new Error('Missing booking type in metadata');
                            }

                            if (!session.metadata?.userId) {
                                throw new Error('Missing user ID in metadata');
                            }

                            // Get user details once
                            const userDetails = await getUserDetails(session.metadata.userId);
                            if (!userDetails) {
                                throw new Error('User not found');
                            }

                            const prefix = {
                                car: 'CR',
                                flight: 'FL',
                                hotel: 'HT',
                                tour: 'TR'
                            }[bookingType];
                            const bookingId = `${prefix}-${randomUUID().split('-')[0].toUpperCase()}`;

                            // Create customer details once
                            const customerDetails: CustomerDetails = {
                                name: session.metadata?.customerName,
                                email: session.metadata?.customerEmail,
                                phone: session.metadata?.customerPhone
                            };

                            const baseBooking: BaseBooking = {
                                bookingId,
                                stripeSessionId: session.id,
                                bookingType,
                                provider: session.metadata?.provider || 'direct',
                                user: userDetails,
                                customer: customerDetails,
                                paymentStatus: 'paid',
                                amount: session.amount_total! / 100,
                                actualAmount: parseFloat(session.metadata?.actualAmount || '0') / 100,
                                currency: session.currency!,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                status: 'confirmed'
                            };

                            let bookingDetails;
                            switch (bookingType) {
                                case 'flight':
                                    bookingDetails = reconstructFlightDetails(session.metadata);
                                    break;
                                case 'hotel':
                                    bookingDetails = JSON.parse(session.metadata.hotel || '{}');
                                    break;
                                case 'car':
                                    bookingDetails = JSON.parse(session.metadata.car || '{}');
                                    break;
                                case 'tour':
                                    bookingDetails = reconstructTourDetails(session.metadata);
                                    break;
                                default:
                                    throw new Error('Invalid booking type');
                            }

                            const bookingData = {
                                ...baseBooking,
                                offerId: session.metadata?.offerId,
                                bookingDetails,
                            };

                            // Create receipt using shared user and customer details
                            const receipt = await createReceipt(
                                session, 
                                bookingId, 
                                bookingType,
                                userDetails,
                                customerDetails
                            );

                            const bookingsCollection = db.collection('bookings');
                            const receiptsCollection = db.collection('receipts');

                            await bookingsCollection.insertOne(bookingData, { session: mongoSession });
                            await receiptsCollection.insertOne(receipt, { session: mongoSession });

                            return { 
                                bookingId, 
                                receiptId: receipt.receiptId 
                            };
                        });
                    });

                    return NextResponse.json({ 
                        received: true,
                        ...result
                    });

                } finally {
                    await mongoSession.endSession();
                }

            } catch (error) {
                console.error('Error processing webhook:', error);
                return NextResponse.json(
                    { 
                        error: error instanceof Error ? error.message : 'Failed to process booking',
                        bookingType: session.metadata?.bookingType 
                    },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('Webhook signature verification failed:', error.message);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}