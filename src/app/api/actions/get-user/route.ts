import client from "@/lib/mongodb";
import mongoose from "mongoose";
import { unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const revalidate = 0;
export const dynamic = 'force-dynamic'

export const POST = async (req: Request) => {
    noStore();
    try {
        const { userId } =await auth();
        const mongoClient = await client;
        const db = mongoClient.db("boarding-sky");
        const collection = await db.collection("users");
        const user = await collection.findOne({ clerkId: userId });
        // console.log(user);
        return NextResponse.json({ data: user });
    } catch (error) {
        console.log(error); 
        return NextResponse.json({ error });
    }
}

