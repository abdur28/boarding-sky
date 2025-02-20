// app/api/config/services/route.ts
import { NextResponse } from "next/server";
import { ServiceConfig } from "@/lib/service-config";

export async function GET() {
  try {
    const [flightEnabled, hotelEnabled, carEnabled] = await Promise.all([
      ServiceConfig.getServiceStatus('flight'),
      ServiceConfig.getServiceStatus('hotel'),
      ServiceConfig.getServiceStatus('car'),
    ]);

    return NextResponse.json({
      success: true,
      services: {
        flight: flightEnabled,
        hotel: hotelEnabled,
        car: carEnabled,
      }
    });
  } catch (error) {
    console.error('Failed to fetch service status:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch service status'
      },
      { status: 500 }
    );
  }
}