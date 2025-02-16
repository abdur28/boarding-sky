'use client'

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import Header from "@/components/Header"
import CheckoutForm from "../CheckOutForm"

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentPageProps {
    searchParams: {
        type: 'flight' | 'hotel' | 'car'
        price: string
        currency: string
        [key: string]: string // for other params specific to each type
    }
}

export default function PaymentPage({ searchParams }: PaymentPageProps) {
    const router = useRouter()
    const [clientSecret, setClientSecret] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    console.log(searchParams)

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
    })

    useEffect(() => {
        const createPaymentIntent = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const response = await fetch("/api/payment/create-payment-intent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: parseFloat(searchParams.price) * 100, // convert to cents
                        currency: searchParams.currency,
                        type: searchParams.type,
                        ...searchParams, // include other booking details
                    }),
                })

                if (!response.ok) {
                    throw new Error('Failed to create payment intent')
                }

                const data = await response.json()
                setClientSecret(data.clientSecret)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setIsLoading(false)
            }
        }

        if (searchParams.price && searchParams.currency) {
            createPaymentIntent()
        }
    }, [searchParams])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const getBookingDetails = () => {
        switch (searchParams.type) {
            case 'flight':
                return (
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Flight Number: {searchParams.flightNumber}</p>
                        <p>Departure: {searchParams.departure}</p>
                        <p>Arrival: {searchParams.arrival}</p>
                        <p>Date: {searchParams.date}</p>
                    </div>
                )
            case 'hotel':
                return (
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Hotel: {searchParams.hotelName}</p>
                        <p>Check-in: {searchParams.checkIn}</p>
                        <p>Check-out: {searchParams.checkOut}</p>
                        <p>Room Type: {searchParams.roomType}</p>
                    </div>
                )
            case 'car':
                return (
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Vehicle: {searchParams.vehicle}</p>
                        <p>Pick-up: {searchParams.pickupDate}</p>
                        <p>Drop-off: {searchParams.dropoffDate}</p>
                        <p>Location: {searchParams.location}</p>
                    </div>
                )
            default:
                return null
        }
    }

    if (isLoading) return <LoadingState />
    if (error) return <ErrorState message={error} />

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#0F172A',
            colorBackground: '#ffffff',
            colorText: '#0F172A',
            colorDanger: '#df1b41',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '4px',
        },
    }

    const options = {
        clientSecret,
        appearance,
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="Payment" />
            <main className="max-w-7xl mx-auto py-8 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Customer Information Form */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Booking Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {getBookingDetails()}
                                <div className="mt-4 pt-4 border-t">
                                    <p className="font-medium">Total Amount</p>
                                    <p className="text-2xl font-bold">
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: searchParams.currency
                                        }).format(parseFloat(searchParams.price))}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="postalCode">Postal Code</Label>
                                        <Input
                                            id="postalCode"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Stripe Payment Form */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {clientSecret && (
                                    <Elements stripe={stripePromise} options={options}>
                                        <CheckoutForm 
                                            clientSecret={clientSecret}
                                            formData={formData}
                                        />
                                    </Elements>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

const LoadingState = () => (
    <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Preparing payment...</p>
    </div>
)

const ErrorState = ({ message }: { message: string }) => (
    <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    </div>
)