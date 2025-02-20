// app/api/actions/get-config/route.ts
import { NextResponse } from "next/server";
import { getUser } from "@/lib/data";
import { ApiKeyManager } from "@/lib/api-keys";
import client from "@/lib/mongodb";

export async function GET(req: Request) {
    try {
        const user = await getUser();
        if (!user || user.role.toLowerCase() !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const mongoClient = await client;
        const db = mongoClient.db("boarding-sky");
        const configCollection = db.collection('config');
        
        let config = await configCollection.findOne({}) || {
            flight: { enabled: false, providers: [] },
            hotel: { enabled: false, providers: [] },
            car: { enabled: false, providers: [] },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const [amadeus, skyscanner, serp, stripe] = await Promise.all([
            ApiKeyManager.getProvider('amadeus'),
            ApiKeyManager.getProvider('skyscanner'),
            ApiKeyManager.getProvider('serp'),
            ApiKeyManager.getProvider('stripe')
        ]);

        const fullConfig = {
            ...config,
            providers: {
                amadeus: amadeus ? {
                    clientId: amadeus.apiKey,
                    clientSecret: amadeus.apiSecret
                } : { clientId: '', clientSecret: '' },
                skyscanner: skyscanner ? {
                    apiKey: skyscanner.apiKey
                } : { apiKey: '' },
                serp: serp ? {
                    apiKey: serp.apiKey
                } : { apiKey: '' }
            },
            stripe: stripe ? {
                secretKey: stripe.apiKey,
                publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
                webhookSecret: stripe.apiSecret
            } : {
                secretKey: '',
                publishableKey: '',
                webhookSecret: ''
            }
        };

        return NextResponse.json({
            success: true,
            data: fullConfig
        });

    } catch (error) {
        console.error('Error in get-config:', error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Failed to fetch configuration',
                success: false 
            },
            { status: 500 }
        );
    }
}
