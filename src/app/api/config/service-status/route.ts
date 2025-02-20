// app/api/config/service-status/route.ts
import { NextResponse } from "next/server";
import { ServiceConfig } from "@/lib/service-config";

export async function POST(req: Request) {
  try {
    const { service } = await req.json();
    const isEnabled = await ServiceConfig.getServiceStatus(service);
    
    if (!isEnabled) {
      return NextResponse.json(
        { error: `${service} service is disabled` },
        { status: 503 }
      );
    }

    return NextResponse.json({ enabled: true });
  } catch (error) {
    console.error('Service status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check service status' },
      { status: 500 }
    );
  }
}