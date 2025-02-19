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
            origin,
            destination,
            departureDate,
            returnDate,
            adults,
            children,
            infants,
            travelClass
        } = body;

        const mongoClient = await client;
        const db = mongoClient.db("boarding-sky");
        const collection = await db.collection("flightOffers");

        // Build query based on search parameters
        const query: any = {};
        
        if (origin) {
            query['itineraries.segments.departure.iataCode'] = origin.toUpperCase();
        }
        
        if (destination) {
            query['itineraries.segments.arrival.iataCode'] = destination.toUpperCase();
        }

        if (travelClass) {
            query['travelClass'] = travelClass.toUpperCase();
        }

        const flightOffers = await collection.find(query).toArray();
        return NextResponse.json({ data: flightOffers });
    } catch (error) {
        console.error('[FLIGHT_OFFERS_API]', error);
        return NextResponse.json(
            { error: 'Failed to fetch flight offers' },
            { status: 500 }
        );
    }
}
