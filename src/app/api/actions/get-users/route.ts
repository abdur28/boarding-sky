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
        const collection = await db.collection("users");
        const users = await collection.find({}).toArray();
        return NextResponse.json({ data: users });
    } catch (error) {
        console.log(error); 
        return NextResponse.json({ error });
    }
}

