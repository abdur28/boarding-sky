// app/api/actions/get-bookings/route.ts
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

        const { filter } = await req.json();
        const mongoClient = await client;
        const db = mongoClient.db("boarding-sky");
        const bookingsCollection = db.collection('bookings');

        let query = {};
        
        // If filter is not 'all', use it as userId filter
        if (filter !== 'all') {
            query = { 'user._id': filter };
        }

        // Add role-based filtering
        const role = user.role.toLowerCase();
        if (!['admin', 'manager'].includes(role)) {
            query = { 'user._id': user._id.toString() };
        }

        const bookings = await bookingsCollection
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();

        // console.log(bookings);
        return NextResponse.json({
            success: true,
            data: bookings
        });

    } catch (error) {
        console.error('Error in get-bookings:', error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Failed to fetch bookings',
                success: false 
            },
            { status: 500 }
        );
    }
}