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

interface PassengerFormProps {
  index: number
  type: 'adult' | 'child' | 'infant'
}

const PassengerForm = ({ index, type }: PassengerFormProps) => {
  return (
    <CardContent className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          Passenger {index + 1} ({type.charAt(0).toUpperCase() + type.slice(1)})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`firstName-${index}`}>First name*</Label>
          <Input id={`firstName-${index}`} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`middleName-${index}`}>Middle name</Label>
          <Input id={`middleName-${index}`} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`lastName-${index}`}>Last name*</Label>
          <Input id={`lastName-${index}`} required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nationality*</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="ng">Nigeria</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Passport Number*</Label>
          <Input required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date of birth*</Label>
          <div className="grid grid-cols-3 gap-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({length: 12}, (_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    {String(i + 1).padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({length: 31}, (_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    {String(i + 1).padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({length: 100}, (_, i) => {
                  const year = new Date().getFullYear() - i
                  return (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Passport Expiry Date*</Label>
          <Input 
            type="date" 
            required 
            min={new Date().toISOString().split('T')[0]} 
          />
        </div>
      </div>

      {index === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address*</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Email for confirmation" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number*</Label>
            <Input id="phone" type="tel" required />
          </div>
        </div>
      )}
    </CardContent>
  )
}

interface FlightBookingPageProps {
  flightData: FlightOffer
}

export default function FlightBookingPage({ flightData }: FlightBookingPageProps) {
  console.log(flightData)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [addProtection, setAddProtection] = useState<boolean | null>(null)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleProceedToPayment = () => {
    if (addProtection === null) {
      alert("Please select whether you want to add flight protection")
      return
    }
    if (!acceptTerms) {
      alert("Please accept the terms and conditions")
      return
    }

    setIsLoading(true)
    
    // Pass the flight data to payment page
    const bookingData = {
      flightData,
      protection: addProtection,
      // Add other booking details here
    }
    
    const encodedData = encodeURIComponent(JSON.stringify(bookingData))
    router.push(`/flight/payment?bookingData=${encodedData}`)
  }

  const protectionCost = Math.round(flightData.price.amount * 0.1 * 100) / 100

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4 lg:pb-0 pb-6">
          <FlightSummary flight={flightData} />
        </div>

        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Who's traveling?</CardTitle>
              <CardDescription>
                Names must match government-issued photo ID exactly
              </CardDescription>
            </CardHeader>
            <PassengerForm index={0} type="adult" />
          </Card>

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
                    <span>Trip cancellation and interruption up to 100% of trip cost</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Medical expense up to $25,000 per person</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Baggage loss up to $500 or delay up to $300 per person</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Travel delay up to $500 per person</span>
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
                        No, I'll risk my ${flightData.price.amount?.toFixed(2)} booking
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review and Book</CardTitle>
              <CardDescription>Please review all details before proceeding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important Information</AlertTitle>
                <AlertDescription>
                <ul className="list-disc pl-4 space-y-2 text-sm">
                    <li>
                      {flightData.meta?.lastTicketingDate && (
                        `Tickets must be purchased by ${formatDate(flightData.meta.lastTicketingDate)}`
                      )}
                    </li>
                    <li>
                      {flightData.fareDetails?.some(detail => detail.features?.refundable) 
                        ? `Tickets are refundable with conditions.`
                        : `Tickets are non-refundable.`
                      }
                    </li>
                    <li>Name changes are not permitted. Ensure all details match your ID.</li>
                    <li>
                      {flightData.fareDetails && flightData.fareDetails[0].baggage.checked 
                        ? `Checked baggage is included (${flightData.fareDetails[0].baggage.checked.quantity} bag per person).`
                        : `Baggage fees may apply and vary by airline.`
                      }
                    </li>
                    <li>Fares are not guaranteed until ticketed.</li>
                    {flightData.meta?.numberOfBookableSeats && (
                      <li>{flightData.meta.numberOfBookableSeats} seats remaining at this price.</li>
                    )}
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
                  I acknowledge that I have reviewed the Privacy Statement, Government Travel Advice, 
                  and have reviewed and accept the Rules & Restrictions and Terms of Use.
                  {flightData.fareDetails?.some(detail => detail.features?.refundable) && (
                    <span className="block mt-1 text-muted-foreground">
                      Cancellation fees may apply as per the fare rules.
                    </span>
                  )}
                </Label>
              </div>

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
                disabled={isLoading || !acceptTerms || addProtection === null}
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