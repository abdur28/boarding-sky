// app/api/actions/decrypt/route.ts
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

    const { encrypted } = await req.json();
    const decrypted = Encryption.decrypt(encrypted);

    return NextResponse.json({ decrypted });
  } catch (error) {
    return NextResponse.json(
      { error: 'Decryption failed' },
      { status: 500 }
    );
  }
}
