// app/api/amadeus/token/route.ts
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { ApiKeyManager } from "@/lib/api-keys";
import { ServiceConfig } from "@/lib/service-config";

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const POST = async (req: Request) => {
    noStore();
    
    try {
        // Check if flight service and Amadeus provider are enabled
        const isServiceEnabled = await ServiceConfig.getServiceStatus('flight');
        if (!isServiceEnabled) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'Flight service is currently disabled'
                },
                { status: 503 }
            );
        }

        const isProviderEnabled = await ServiceConfig.isProviderEnabled('flight', 'amadeus');
        if (!isProviderEnabled) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'Amadeus provider is not available'
                },
                { status: 503 }
            );
        }

        // Get Amadeus credentials from secure storage
        const provider = await ApiKeyManager.getProvider('amadeus');
        if (!provider?.apiKey || !provider?.apiSecret) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'Amadeus credentials not configured'
                },
                { status: 500 }
            );
        }

        const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=client_credentials&client_id=${provider.apiKey}&client_secret=${provider.apiSecret}`
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { 
                    success: false,
                    error: errorData.error_description || 'Failed to get Amadeus token'
                },
                { status: response.status }
            );
        }

        const data = await response.json();
        
        return NextResponse.json({ 
            success: true, 
            data: {
                access_token: data.access_token,
                expires_in: data.expires_in,
                token_type: data.token_type
            }
        });

    } catch (error) {
        console.error('Error getting Amadeus token:', error);
        return NextResponse.json(
            { 
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error'
            },
            { status: 500 }
        );
    }
};