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
            city,
            checkIn,
            checkOut,
            adults,
            children,
            rooms,
            priceRange,
            amenities,
            hotelClass
        } = body;

        const mongoClient = await client;
        const db = mongoClient.db("boarding-sky");
        const collection = await db.collection("hotelOffers");

        // Build query based on search parameters
        const query: any = {};
        
        if (city) {
            query['location.cityCode'] = { 
                $regex: new RegExp(city, 'i') 
            };
        }

        if (priceRange) {
            if (priceRange.min) {
                query['price.current'] = { $gte: priceRange.min };
            }
            if (priceRange.max) {
                query['price.current'] = { 
                    ...query['price.current'],
                    $lte: priceRange.max 
                };
            }
        }

        if (amenities?.length) {
            query.amenities = { $all: amenities };
        }

        if (hotelClass?.length) {
            query.hotelClass = { $in: hotelClass };
        }

        const hotelOffers = await collection.find(query).toArray();
        return NextResponse.json({ data: hotelOffers });
    } catch (error) {
        console.error('[HOTEL_OFFERS_API]', error);
        return NextResponse.json(
            { error: 'Failed to fetch hotel offers' },
            { status: 500 }
        );
    }
}

