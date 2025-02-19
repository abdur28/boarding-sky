import client from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const mongoClient = await client;
    const db = mongoClient.db("boarding-sky");
    const collection = db.collection("policy")
    const data = await collection.findOne({ type: "privacy-policy" });
    return NextResponse.json({ success: true, content: data?.content || "" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch privacy policy" },
      { status: 500 }
    );
  }
}