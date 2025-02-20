// app/api/actions/update-config/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ApiKeyManager } from "@/lib/api-keys";
import { Encryption } from "@/lib/crypto";
import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
    try {
        // Check auth
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Ensure encryption is initialized
        if (!Encryption.isInitialized()) {
            Encryption.initialize();
        }

        const config = await req.json();
        const mongoClient = await client;
        const db = mongoClient.db("boarding-sky");
        const configCollection = db.collection('config');

        // Extract sensitive data before storing in main config
        const { providers, stripe, ...mainConfig } = config;

        // Store provider configurations securely
        if (providers?.amadeus) {
            await ApiKeyManager.storeProviderKeys({
                id: 'amadeus',
                name: 'Amadeus',
                type: 'amadeus',
                isActive: mainConfig.flight.providers.includes('amadeus'),
                baseUrl: process.env.AMADEUS_BASE_URL || 'https://api.amadeus.com',
                apiKey: providers.amadeus.clientId,
                apiSecret: providers.amadeus.clientSecret
            });
        }

        if (providers?.skyscanner) {
            await ApiKeyManager.storeProviderKeys({
                id: 'skyscanner',
                name: 'Skyscanner',
                type: 'skyscanner',
                isActive: mainConfig.flight.providers.includes('skyscanner') || 
                         mainConfig.car.providers.includes('skyscanner'),
                baseUrl: process.env.SKYSCANNER_BASE_URL || 'https://api.skyscanner.net',
                apiKey: providers.skyscanner.apiKey
            });
        }

        if (providers?.serp) {
            await ApiKeyManager.storeProviderKeys({
                id: 'serp',
                name: 'SERP API',
                type: 'serp',
                isActive: mainConfig.hotel.providers.includes('serp'),
                baseUrl: process.env.SERP_BASE_URL || 'https://serpapi.com',
                apiKey: providers.serp.apiKey
            });
        }

        // Store Stripe configuration securely
        if (stripe) {
            await ApiKeyManager.storeProviderKeys({
                id: 'stripe',
                name: 'Stripe',
                type: 'custom',
                isActive: true,
                baseUrl: 'https://api.stripe.com',
                apiKey: stripe.secretKey,
                apiSecret: stripe.webhookSecret
            });
        }

        // Store main configuration without sensitive data
        const { _id, ...configWithoutId } = mainConfig;
        
        await configCollection.updateOne(
            { _id: _id ? new ObjectId(_id) : new ObjectId() },
            { 
                $set: {
                    ...configWithoutId,
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Configuration updated successfully'
        });

    } catch (error) {
        console.error('Error in update-config:', error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Failed to update configuration',
                success: false 
            },
            { status: 500 }
        );
    }
}