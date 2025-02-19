import client from "@/lib/mongodb";
import mongoose from "mongoose";
import { unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = 'force-dynamic'

export const POST = async (req: Request) => {
    noStore();
    try {
        const { id } = await req.json();
        const mongoClient = await client;
        const db = mongoClient.db("boarding-sky");
        const collection = await db.collection("carOffers");
        const carOffer = await collection.findOne({ id: id });
        return NextResponse.json({ data: carOffer });
    } catch (error) {
        console.log(error); 
        return NextResponse.json({ error });
    }
}

