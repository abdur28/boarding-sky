// app/api/create-checkout-session/route.ts
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
    noStore();
    try {
        const body = await req.json();
        const { carOffer, bookingDetails } = body;

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: carOffer.price.currency.toLowerCase(),
                        product_data: {
                            name: `${carOffer.name} - ${carOffer.model}`,
                            description: `Pickup: ${bookingDetails.pickupDate} at ${carOffer.pickupLocation.name}`,
                            images: carOffer.images.map((img: any) => img.url),
                        },
                        unit_amount: Math.round(carOffer.price.amount * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                carId: carOffer.id,
                pickupDate: bookingDetails.pickupDate,
                dropoffDate: bookingDetails.dropoffDate,
                pickupLocation: bookingDetails.pickupLocation,
                dropoffLocation: bookingDetails.dropoffLocation,
                driverName: `${bookingDetails.firstName} ${bookingDetails.lastName}`,
                driverEmail: bookingDetails.email,
            },
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/car/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/car/booking/cancel`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Error in create-checkout-session:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}