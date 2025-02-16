// app/api/webhooks/route.ts
import { stripe } from "@/lib/stripe";
import client from "@/lib/mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        try {
            const data = {
                stripeSessionId: session.id,
                paymentStatus: 'paid',
                amount: session.amount_total! / 100, // Convert from cents
                currency: session.currency,
                customerEmail: session.customer_details?.email,
                carId: session.metadata?.carId,
                bookingDetails: {
                    pickupDate: session.metadata?.pickupDate,
                    dropoffDate: session.metadata?.dropoffDate,
                    pickupLocation: session.metadata?.pickupLocation,
                    dropoffLocation: session.metadata?.dropoffLocation,
                    driverName: session.metadata?.driverName,
                    driverEmail: session.metadata?.driverEmail,
                },
                createdAt: new Date(),
                status: 'confirmed'
            }
            console.log(data)
            // const mongoClient = await client;
            // const db = mongoClient.db("boarding-sky");
            // const bookingsCollection = db.collection("car-bookings");

            // // Create booking record
            // await bookingsCollection.insertOne({
            //     stripeSessionId: session.id,
            //     paymentStatus: 'paid',
            //     amount: session.amount_total! / 100, // Convert from cents
            //     currency: session.currency,
            //     customerEmail: session.customer_details?.email,
            //     carId: session.metadata?.carId,
            //     bookingDetails: {
            //         pickupDate: session.metadata?.pickupDate,
            //         dropoffDate: session.metadata?.dropoffDate,
            //         pickupLocation: session.metadata?.pickupLocation,
            //         dropoffLocation: session.metadata?.dropoffLocation,
            //         driverName: session.metadata?.driverName,
            //         driverEmail: session.metadata?.driverEmail,
            //     },
            //     createdAt: new Date(),
            //     status: 'confirmed'
            // });

            // You could also send confirmation emails here
        } catch (error) {
            console.error('Error saving booking:', error);
            return NextResponse.json(
                { error: 'Failed to save booking' },
                { status: 500 }
            );
        }
    }

    return NextResponse.json({ received: true });
}