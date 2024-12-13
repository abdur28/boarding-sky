import client from "@/lib/mongodb";
import mongoose from "mongoose";
import { unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = 'force-dynamic'

export const POST = async (req: Request) => {
    noStore();
    try {
        const mongoClient = await client;
        const db = mongoClient.db("boarding-sky");
        const collection = await db.collection("cars");
        const cars = await collection.find({}).toArray();
        return NextResponse.json({ data: cars });
    } catch (error) {
        console.log(error); 
        return NextResponse.json({ error });
    }
}

