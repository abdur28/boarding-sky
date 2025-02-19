// app/api/actions/get-receipt/route.ts
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

        const { receiptId } = await req.json();
        const mongoClient = await client;
        const db = mongoClient.db("boarding-sky");
        
        // Find receipt
        const receiptsCollection = db.collection('receipts');
        const receipt = await receiptsCollection.findOne({ receiptId });

        if (!receipt) {
            return NextResponse.json(
                { error: 'Receipt not found' },
                { status: 404 }
            );
        }

        // Check authorization
        const role = user.role.toLowerCase();
        const isHigherRole = ['admin', 'manager'].includes(role);
        if (!isHigherRole && receipt.user._id !== user._id.toString()) {
            return NextResponse.json(
                { error: 'Unauthorized to view this receipt' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            data: receipt
        });

    } catch (error) {
        console.error('Error in get-receipt:', error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Failed to fetch receipt',
                success: false 
            },
            { status: 500 }
        );
    }
}