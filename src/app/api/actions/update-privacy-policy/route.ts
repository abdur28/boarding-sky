import client from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { content } = await request.json();
  try {
    const mongoClient = await client;
    const db = mongoClient.db("boarding-sky");
    const collection = db.collection("policy");
    await collection.updateOne(
      { type: "privacy-policy" },
      { $set: { content } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update privacy policy" },
      { status: 500 }
    );
  }
}