'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, Users, CreditCard, Loader2, Coffee, Bed } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const BookingSummary = ({ booking }: { booking: any }) => {
  return (
    <Card className="lg:sticky lg:top-20">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
        <CardDescription>Review your hotel booking details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hotel and Room Info */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Grand Plaza Hotel</h3>
            <p className="text-muted-foreground">Downtown London</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Bed className="h-4 w-4" />
              <span>Deluxe Room</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              <span>2 Guests</span>
            </div>
          </div>
          
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4" />
              <div>
                <p>Check-in: Feb 26, 2024</p>
                <p>Check-out: Mar 1, 2024</p>
                <p className="text-muted-foreground">(3 nights)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Room rate (3 nights)</span>
            <span>$600.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Taxes and fees</span>
            <span>$72.00</span>
          </div>

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>$672.00</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function HotelBookingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'arrival' | null>(null)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleProceed = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method")
      return
    }
    if (!acceptTerms) {
      alert("Please accept the terms and conditions")
      return
    }

    setIsLoading(true)
    if (paymentMethod === 'online') {
      router.push('/hotel/payment/HTL123')
    } else {
      // Handle pay on arrival
      try {
        // Here you would make an API call to create the booking
        await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
        router.push('/booking/confirmation')
      } catch (error) {
        console.error('Booking failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Left Side - Booking Summary */}
        <div className="pb-6 lg:pb-0 lg:col-span-4">
          <BookingSummary booking={{}} />
        </div>

        {/* Right Side - Booking Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Guest Information */}
          <Card>
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
              <CardDescription>
                Please provide the details of the main guest
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title*</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mr">Mr</SelectItem>
                      <SelectItem value="mrs">Mrs</SelectItem>
                      <SelectItem value="ms">Ms</SelectItem>
                      <SelectItem value="dr">Dr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name*</Label>
                  <Input id="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name*</Label>
                  <Input id="lastName" required />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address*</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="For booking confirmation"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number*</Label>
                  <Input id="phone" type="tel" required />
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-2">
                <Label htmlFor="requests">Special Requests</Label>
                <Input 
                  id="requests" 
                  placeholder="e.g., High floor, Quiet room, etc."
                />
                <p className="text-sm text-muted-foreground">
                  Special requests cannot be guaranteed but we will try our best to accommodate them
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Choose how you would like to pay for your stay
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup 
                onValueChange={(value) => setPaymentMethod(value as 'online' | 'arrival')}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="online" id="payment-online" />
                  <Label htmlFor="payment-online" className="flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Pay Now</p>
                        <p className="text-sm text-muted-foreground">Secure online payment</p>
                      </div>
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="arrival" id="payment-arrival" />
                  <Label htmlFor="payment-arrival" className="flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Pay at Hotel</p>
                        <p className="text-sm text-muted-foreground">Pay during check-in</p>
                      </div>
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Review and Book</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertTitle>Important Information</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4 space-y-2 text-sm">
                    <li>Check-in time starts at 3 PM</li>
                    <li>Check-out time is 12 PM</li>
                    <li>Free cancellation until 24 hours before check-in</li>
                    <li>Photo ID required at check-in</li>
                    <li>Credit card may be required for incidental charges</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptTerms} 
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)} 
                />
                <Label htmlFor="terms" className="text-sm">
                  I acknowledge that I have reviewed and accept the booking terms,
                  cancellation policy, and hotel rules and regulations.
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                Back
              </Button>
              <Button 
                onClick={handleProceed} 
                disabled={isLoading || !acceptTerms || !paymentMethod}
                className="min-w-[200px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : paymentMethod === 'online' ? (
                  'Proceed to Payment'
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};