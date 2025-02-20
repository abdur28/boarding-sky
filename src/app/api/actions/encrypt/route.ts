// app/api/actions/encrypt/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Encryption } from "@/lib/crypto";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { text } = await req.json();
    const encrypted = Encryption.encrypt(text);

    return NextResponse.json({ encrypted });
  } catch (error) {
    return NextResponse.json(
      { error: 'Encryption failed' },
      { status: 500 }
    );
  }
}