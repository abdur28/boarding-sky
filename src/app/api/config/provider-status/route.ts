// app/api/config/provider-status/route.ts
import { NextResponse } from "next/server";
import { ServiceConfig } from "@/lib/service-config";

export async function POST(req: Request) {
  try {
    const { service, providerId } = await req.json();
    const isEnabled = await ServiceConfig.isProviderEnabled(service, providerId);
    
    if (!isEnabled) {
      return NextResponse.json(
        { error: `Provider ${providerId} is not available` },
        { status: 503 }
      );
    }

    return NextResponse.json({ enabled: true });
  } catch (error) {
    console.error('Provider status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check provider status' },
      { status: 500 }
    );
  }
}
