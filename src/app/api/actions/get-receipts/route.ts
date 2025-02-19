// app/api/actions/get-receipts/route.ts
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
        const receiptsCollection = db.collection('receipts');

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

        const receipts = await receiptsCollection
            .find(query)
            .sort({ transactionDate: -1 })
            .toArray();

        return NextResponse.json({
            success: true,
            data: receipts
        });

    } catch (error) {
        console.error('Error in get-receipts:', error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Failed to fetch receipts',
                success: false 
            },
            { status: 500 }
        );
    }
}