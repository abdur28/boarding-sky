// app/api/actions/get-config/route.ts
import { NextResponse } from "next/server";
import { getUser } from "@/lib/data";
import client from "@/lib/mongodb";

export async function GET(req: Request) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if user is admin
        const role = user.role.toLowerCase();
        if (role !== 'admin') {
            return NextResponse.json(
                { error: 'Only admins can access configuration' },
                { status: 403 }
            );
        }

        const mongoClient = await client;
        const db = mongoClient.db("boarding-sky");
        const configCollection = db.collection('config');
        
        // Get configuration, create default if doesn't exist
        let config: any = await configCollection.findOne({});
        
        if (!config) {
            const defaultConfig = {
                flight: {
                    enabled: false,
                    providers: []
                },
                hotel: {
                    enabled: false,
                    providers: []
                },
                car: {
                    enabled: false,
                    providers: []
                },
                stripe: {
                    secretKey: '',
                    publishableKey: '',
                    webhookSecret: ''
                },
                providers: {
                    amadeus: {
                        clientId: '',
                        clientSecret: ''
                    },
                    skyscanner: {
                        apiKey: ''
                    },
                    serp: {
                        apiKey: ''
                    }
                },
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await configCollection.insertOne(defaultConfig);
            config = defaultConfig;
        }

        return NextResponse.json({
            success: true,
            data: config
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