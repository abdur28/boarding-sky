// app/api/actions/get-booking/route.ts
import { NextResponse } from "next/server";
import { getUser } from "@/lib/data";
import client from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { bookingId } = await req.json();
        const mongoClient = await client;
        const db = mongoClient.db("boarding-sky");
        
        // Find booking
        const bookingsCollection = db.collection('bookings');
        const booking = await bookingsCollection.findOne({ bookingId });

        if (!booking) {
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }

        // Check authorization
        const role = user.role.toLowerCase();
        const isHigherRole = ['admin', 'manager'].includes(role);
        if (!isHigherRole && booking.user._id !== user._id.toString()) {
            return NextResponse.json(
                { error: 'Unauthorized to view this booking' },
                { status: 403 }
            );
        }

        // Get receipt
        const receiptsCollection = db.collection('receipts');
        const receipt = await receiptsCollection.findOne({ bookingId });

        return NextResponse.json({
            success: true,
            data: {
                booking,
                receipt
            }
        });

    } catch (error) {
        console.error('Error in get-booking:', error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Failed to fetch booking',
                success: false 
            },
            { status: 500 }
        );
    }
}