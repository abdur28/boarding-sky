
// app/api/actions/validate-config/route.ts
import { NextResponse } from "next/server";
import { getUser } from "@/lib/data";
import { ApiKeyManager } from "@/lib/api-keys";

export async function POST(req: Request) {
    try {
        const user = await getUser();
        if (!user || user.role.toLowerCase() !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const results = await Promise.all([
            ApiKeyManager.validateProviderKeys('amadeus'),
            ApiKeyManager.validateProviderKeys('skyscanner'),
            ApiKeyManager.validateProviderKeys('serp'),
            ApiKeyManager.validateProviderKeys('stripe')
        ]);

        return NextResponse.json({
            success: true,
            data: {
                amadeus: results[0],
                skyscanner: results[1],
                serp: results[2],
                stripe: results[3]
            }
        });

    } catch (error) {
        console.error('Error in validate-config:', error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Failed to validate configuration',
                success: false 
            },
            { status: 500 }
        );
    }
}