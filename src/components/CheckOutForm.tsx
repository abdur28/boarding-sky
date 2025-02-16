'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface CheckoutFormProps {
    clientSecret: string
    formData: {
        firstName: string
        lastName: string
        email: string
        phone: string
        address: string
        city: string
        country: string
        postalCode: string
    }
}

export default function CheckoutForm({ clientSecret, formData }: CheckoutFormProps) {
    const stripe = useStripe()
    const elements = useElements()
    const router = useRouter()
    const [message, setMessage] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            return
        }

        setIsProcessing(true)

        // Validate form data
        const requiredFields = Object.entries(formData)
        const emptyFields = requiredFields.filter(([_, value]) => !value.trim())
        
        if (emptyFields.length > 0) {
            setMessage("Please fill in all required fields")
            setIsProcessing(false)
            return
        }

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment/success`,
                payment_method_data: {
                    billing_details: {
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                        phone: formData.phone,
                        address: {
                            line1: formData.address,
                            city: formData.city,
                            country: formData.country,
                            postal_code: formData.postalCode,
                        },
                    },
                },
            },
        })

        if (error) {
            setMessage(error.message ?? "An unexpected error occurred.")
        } else {
            setMessage("Payment successful!")
            router.push('/payment/success')
        }

        setIsProcessing(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            
            {message && (
                <div className={`p-4 rounded-md ${
                    message.includes("successful") 
                        ? "bg-green-50 text-green-700" 
                        : "bg-red-50 text-red-700"
                }`}>
                    {message}
                </div>
            )}
            
            <Button
                type="submit"
                disabled={isProcessing || !stripe || !elements}
                className="w-full"
            >
                {isProcessing ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                    </div>
                ) : (
                    "Pay Now"
                )}
            </Button>
        </form>
    )
}