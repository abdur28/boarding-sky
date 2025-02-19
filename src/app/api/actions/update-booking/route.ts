// app/api/actions/update-booking/route.ts
import { NextResponse } from "next/server";
import { getUser } from "@/lib/data";
import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';
type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

interface UpdateBookingBody {
    bookingId: string;
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
    isRefundable?: boolean;
    // Add any other fields that can be updated
}

export async function POST(req: Request) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Only admin and managers can update bookings
        if (!['admin', 'manager'].includes(user.role.toLowerCase())) {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        const body: UpdateBookingBody = await req.json();
        
        // Validate required fields
        if (!body.bookingId) {
            return NextResponse.json(
                { error: 'Booking ID is required' },
                { status: 400 }
            );
        }

        const mongoClient = await client;
        const db = mongoClient.db("boarding-sky");
        const bookingsCollection = db.collection('bookings');
        const session = mongoClient.startSession();

        try {
            const result = await session.withTransaction(async () => {
                // Find the existing booking
                const existingBooking = await bookingsCollection.findOne(
                    { bookingId: body.bookingId },
                    { session }
                );

                if (!existingBooking) {
                    throw new Error('Booking not found');
                }

                // Prepare update object with only provided fields
                const update: Partial<UpdateBookingBody> = {};
                
                if (body.status) {
                    update.status = body.status;
                }
                
                if (body.paymentStatus) {
                    update.paymentStatus = body.paymentStatus;
                }
                
                if (typeof body.isRefundable === 'boolean') {
                    update.isRefundable = body.isRefundable;
                }

                // Add updatedAt timestamp
                Object.assign(update, {
                    updatedAt: new Date(),
                    updatedBy: {
                        userId: user._id,
                        name: `${user.firstName} ${user.lastName}`,
                        role: user.role
                    }
                });

                // Perform the update
                const updateResult = await bookingsCollection.updateOne(
                    { bookingId: body.bookingId },
                    { $set: update },
                    { session }
                );

                if (!updateResult.matchedCount) {
                    throw new Error('Failed to update booking');
                }

                // Fetch and return the updated booking
                return await bookingsCollection.findOne(
                    { bookingId: body.bookingId },
                    { session }
                );
            });

            return NextResponse.json({
                success: true,
                data: result
            });

        } catch (error) {
            throw error;
        } finally {
            await session.endSession();
        }

    } catch (error) {
        console.error('Error in update-booking:', error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Failed to update booking',
                success: false 
            },
            { status: 500 }
        );
    }
}

// Utility function to validate booking status
function isValidBookingStatus(status: string): status is BookingStatus {
    return ['confirmed', 'pending', 'cancelled', 'completed'].includes(status);
}

// Utility function to validate payment status
function isValidPaymentStatus(status: string): status is PaymentStatus {
    return ['paid', 'pending', 'failed', 'refunded'].includes(status);
}