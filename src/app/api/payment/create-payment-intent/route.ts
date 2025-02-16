// app/api/payment/create-payment-intent/route.ts

import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-01-27.acacia", // Specify your preferred API version
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const {
            amount,
            currency,
            type,
            // Additional booking details based on type
            ...bookingDetails
        } = body

        // Validate required fields
        if (!amount || !currency || !type) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Create a description based on booking type
        let description = ""
        let metadata: Record<string, string> = {}

        switch (type) {
            case "flight":
                description = `Flight booking: ${bookingDetails.departure} to ${bookingDetails.arrival}`
                metadata = {
                    type: "flight",
                    flightNumber: bookingDetails.flightNumber,
                    departure: bookingDetails.departure,
                    arrival: bookingDetails.arrival,
                    date: bookingDetails.date,
                }
                break

            case "hotel":
                description = `Hotel booking: ${bookingDetails.hotelName}`
                metadata = {
                    type: "hotel",
                    hotelName: bookingDetails.hotelName,
                    checkIn: bookingDetails.checkIn,
                    checkOut: bookingDetails.checkOut,
                    roomType: bookingDetails.roomType,
                }
                break

            case "car":
                description = `Car rental: ${bookingDetails.vehicle}`
                metadata = {
                    type: "car",
                    vehicle: bookingDetails.vehicle,
                    pickupDate: bookingDetails.pickupDate,
                    dropoffDate: bookingDetails.dropoffDate,
                    location: bookingDetails.location,
                }
                break

            default:
                return NextResponse.json(
                    { error: "Invalid booking type" },
                    { status: 400 }
                )
        }

        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Amount in cents
            currency,
            // Configure payment methods you want to accept
            payment_method_types: ["card"],
            description,
            metadata,
            // Configure automatic payment methods
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never",
            },
            // Optional: Set up confirmation method
            confirmation_method: "automatic",
        })

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        })
    } catch (error) {
        console.error("Error creating payment intent:", error)
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : "An error occurred while processing payment" 
            },
            { status: 500 }
        )
    }
}

// Optional: Handle GET request to retrieve payment intent status
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const paymentIntentId = searchParams.get("payment_intent")

        if (!paymentIntentId) {
            return NextResponse.json(
                { error: "Payment intent ID is required" },
                { status: 400 }
            )
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
        
        return NextResponse.json({
            status: paymentIntent.status,
            clientSecret: paymentIntent.client_secret,
        })
    } catch (error) {
        console.error("Error retrieving payment intent:", error)
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : "Failed to retrieve payment status" 
            },
            { status: 500 }
        )
    }
}