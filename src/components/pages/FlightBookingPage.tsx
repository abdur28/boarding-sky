'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlaneTakeoff, PlaneLanding, Users, CreditCard, Loader2, Shield, Check, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FlightOffer } from "@/types"
import { FlightBookingForm } from '../forms/FlightBookingForm'

interface FlightSummaryProps {
  flight: FlightOffer
}

const formatDate = (dateString: string) => {
  // Use a consistent date format that won't change between server and client
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}


const FlightSummary = ({ flight }: FlightSummaryProps) => {
  const formatFlightDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return {
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }
  }

  return (
    <Card className="lg:sticky lg:top-20">
      <CardHeader>
        <CardTitle>Your Trip Summary</CardTitle>
        <CardDescription>Review your flight details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {flight.itineraries.map((itinerary, index) => {
          const firstSegment = itinerary.segments[0]
          const lastSegment = itinerary.segments[itinerary.segments.length - 1]
          const departure = formatFlightDateTime(firstSegment.departure.at)
          const arrival = formatFlightDateTime(lastSegment.arrival.at)

          return (
            <div key={index} className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {index === 0 ? <PlaneTakeoff className="h-4 w-4" /> : <PlaneLanding className="h-4 w-4" />}
                <span>
                  {index === 0 ? 'Outbound' : 'Return'} Flight • {itinerary.duration.replace('PT', '').toLowerCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-2xl font-bold">{departure.time}</p>
                  <p className="text-sm text-muted-foreground">{departure.date}</p>
                  <p className="font-medium">{firstSegment.departure.iataCode}</p>
                  {firstSegment.departure.terminal && (
                    <p className="text-sm text-muted-foreground">Terminal {firstSegment.departure.terminal}</p>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-full border-t border-dashed border-gray-300" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{arrival.time}</p>
                  <p className="text-sm text-muted-foreground">{arrival.date}</p>
                  <p className="font-medium">{lastSegment.arrival.iataCode}</p>
                  {lastSegment.arrival.terminal && (
                    <p className="text-sm text-muted-foreground">Terminal {lastSegment.arrival.terminal}</p>
                  )}
                </div>
              </div>

              <div className="text-sm space-y-1">
                <p className="font-medium">
                  {flight.dictionaries?.carriers?.[firstSegment.carrierCode]} {firstSegment.number}
                </p>
                {flight.fareDetails && <p className="text-muted-foreground">{flight.fareDetails[index].cabin}</p>}
                {firstSegment.aircraft.name && (
                  <p className="text-muted-foreground">{firstSegment.aircraft.name}</p>
                )}
              </div>
            </div>
          )
        })}

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Travelers</span>
            </div>
            <span>1 Adult</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Price</span>
            </div>
            <span className="font-bold">${flight.price.amount?.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-primary/5 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Price</span>
            <span className="text-2xl font-bold">${flight.price.amount?.toFixed(2)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            All prices quoted in {flight.price.currency}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

interface PassengerInfo {
  type: 'adult' | 'child' | 'infant'
  firstName: string
  lastName: string
  nationality: string
  passportNumber: string
  dateOfBirth: Date | undefined
  passportExpiry: Date | undefined
}

interface FlightBookingPageProps {
  flightData: FlightOffer;
  passengerCounts: {
    adults: number;
    children: number;
    infants: number;
  };
}

export default function FlightBookingPage({ flightData, passengerCounts }: FlightBookingPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [addProtection, setAddProtection] = useState<boolean | null>(null)
  const [isFormValid, setIsFormValid] = useState(false)
  const [formData, setFormData] = useState<any>(null)

  // Create array of passenger types based on counts
  const passengerTypes = [
    ...Array(passengerCounts.adults).fill('adult'),
    ...Array(passengerCounts.children).fill('child'),
    ...Array(passengerCounts.infants).fill('infant'),
  ] as Array<'adult' | 'child' | 'infant'>

  const protectionCost = Math.round(flightData.price.amount * 0.1 * 100) / 100

  const handleFormChange = (isValid: boolean, data: any) => {
    setIsFormValid(isValid)
    setFormData(data)
  }

  const handleProceedToPayment = async () => {
    if (!isFormValid || !formData || addProtection === null) return
    setIsLoading(true)

    try {
      const response = await fetch('/api/payment/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingType: 'flight',
          offer: flightData,
          price: addProtection ? flightData.price.amount + protectionCost : flightData.price.amount,
          bookingDetails: {
            email: formData.email,
            phone: formData.phone,
            firstName: formData.passengers[0].firstName,
            lastName: formData.passengers[0].lastName,
            passengerDetails: formData.passengers.map((p: any) => ({
              type: p.type,
              firstName: p.firstName,
              lastName: p.lastName,
              dateOfBirth: p.dateOfBirth,
              passportNumber: p.passportNumber,
            })),
          },
          provider: flightData.providerId,
          addProtection: addProtection,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('Invalid checkout session response')
      }
    } catch (error) {
      console.error('Error:', error)
      // Handle error appropriately
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4 lg:pb-0 pb-6">
          <FlightSummary flight={flightData} />
        </div>

        <div className="lg:col-span-8 space-y-6">
          {/* Booking Form */}
          <FlightBookingForm
            onFormChange={handleFormChange}
            passengerTypes={passengerTypes}
          />

          {/* Flight Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Protect your flight
              </CardTitle>
              <CardDescription>Recommended coverage for your trip</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Trip cancellation coverage up to 100% of trip cost</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Medical expense coverage up to $25,000 per person</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Baggage protection up to $500 per person</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <RadioGroup onValueChange={(value) => setAddProtection(value === 'yes')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="protection-yes" />
                      <Label htmlFor="protection-yes" className="font-normal">
                        Yes, add protection for ${protectionCost}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="protection-no" />
                      <Label htmlFor="protection-no" className="font-normal">
                        No, I'll risk my ${flightData.price.amount?.toFixed(2)} trip
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Summary and Proceed */}
          <Card>
            <CardHeader>
              <CardTitle>Review and Book</CardTitle>
              <CardDescription>Please review all details before proceeding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/5 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span>Flight Cost</span>
                  <span>${flightData.price.amount?.toFixed(2)}</span>
                </div>
                {addProtection && (
                  <div className="flex justify-between items-center">
                    <span>Travel Protection</span>
                    <span>${protectionCost}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>
                    ${addProtection 
                      ? (flightData.price.amount + protectionCost).toFixed(2)
                      : flightData.price.amount?.toFixed(2)
                    }
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  All prices quoted in {flightData.price.currency}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button 
                onClick={handleProceedToPayment} 
                disabled={isLoading || !isFormValid || addProtection === null}
                className="min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}