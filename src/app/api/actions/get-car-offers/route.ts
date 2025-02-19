import client from "@/lib/mongodb";
import mongoose from "mongoose";
import { unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = 'force-dynamic'

export const POST = async (req: Request) => {
    noStore();
    try {
        const body = await req.json();
        const { 
            pickUpLocation, 
            dropOffLocation,
            pickUpDate,
            dropOffDate,
            pickUpTime,
            dropOffTime 
        } = body;

        const mongoClient = await client;
        const db = mongoClient.db("boarding-sky");
        const collection = await db.collection("carOffers");

        // Build query based on search parameters
        const query: any = {};
        
        if (pickUpLocation) {
            query['pickupLocation.name'] = { 
                $regex: new RegExp(pickUpLocation, 'i') 
            };
        }
        
        if (dropOffLocation) {
            query['dropoffLocation.name'] = { 
                $regex: new RegExp(dropOffLocation, 'i') 
            };
        }

        // Add date/time filtering if needed
        if (pickUpDate) {
            query.pickupDateTime = {
                $gte: new Date(pickUpDate + 'T' + (pickUpTime || '00:00')).toISOString()
            };
        }

        if (dropOffDate) {
            query.dropoffDateTime = {
                $lte: new Date(dropOffDate + 'T' + (dropOffTime || '23:59')).toISOString()
            };
        }

        // Add status filter to only get available cars
        query.status = 'available';

        const carOffers = await collection.find(query).toArray();
        return NextResponse.json({ data: carOffers });
    } catch (error) {
        console.error('[CAR_OFFERS_API]', error);
        return NextResponse.json(
            { error: 'Failed to fetch car offers' },
            { status: 500 }
        );
    }
}
