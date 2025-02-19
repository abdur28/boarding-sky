// app/api/actions/update-config/route.ts
import { NextResponse } from "next/server";
import { getUser } from "@/lib/data";
import client from "@/lib/mongodb";

export async function POST(req: Request) {
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
                { error: 'Only admins can update configuration' },
                { status: 403 }
            );
        }

        const config = await req.json();
        const mongoClient = await client;
        const db = mongoClient.db("boarding-sky");
        const configCollection = db.collection('config');

        // Remove _id from config if it exists
        const { _id, ...configWithoutId } = config;

        // Find existing config
        const existingConfig = await configCollection.findOne({});

        if (existingConfig) {
            // Update existing configuration
            await configCollection.updateOne(
                { _id: existingConfig._id },
                { 
                    $set: {
                        ...configWithoutId,
                        updatedAt: new Date()
                    }
                }
            );
        } else {
            // Create new configuration
            await configCollection.insertOne({
                ...configWithoutId,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

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