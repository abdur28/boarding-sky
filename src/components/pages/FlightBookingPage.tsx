'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlaneTakeoff, PlaneLanding, Clock, Users, CreditCard, Loader2, Shield, Check, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from '../ui/checkbox'

  // Example flight data
  const flight = {
    id: "FL123",
    price: 1332.60,
    itineraries: [{
      duration: "PT6H40M",
      segments: [{
        departure: {
          at: "2024-02-26T08:50:00",
          iataCode: "ABV"
        },
        arrival: {
          at: "2024-02-26T14:30:00",
          iataCode: "LHR"
        },
        carrierCode: "BA",
        number: "82"
      }]
    }]
  }



const FlightSummary = ({ flight }: { flight: any }) => {
  return (
    <Card className="lg:sticky lg:top-20">
      <CardHeader>
        <CardTitle>Your Trip Summary</CardTitle>
        <CardDescription>Review your flight details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Outbound Flight */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <PlaneTakeoff className="h-4 w-4" />
            <span>Outbound Flight • {flight.itineraries[0].duration.replace('PT', '').toLowerCase()}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-2xl font-bold">8:50</p>
              <p className="text-sm text-muted-foreground">Wed, Feb 26</p>
              <p className="font-medium">ABV</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full border-t border-dashed border-gray-300" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">14:30</p>
              <p className="text-sm text-muted-foreground">Wed, Feb 26</p>
              <p className="font-medium">LHR</p>
            </div>
          </div>

          <div className="text-sm space-y-1">
            <p className="font-medium">British Airways 82</p>
            <p className="text-muted-foreground">Economy</p>
          </div>
        </div>

 

        {/* Return Flight */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <PlaneLanding className="h-4 w-4" />
            <span>Return Flight • 6h 10m</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-2xl font-bold">22:30</p>
              <p className="text-sm text-muted-foreground">Wed, Mar 5</p>
              <p className="font-medium">LHR</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full border-t border-dashed border-gray-300" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">05:40</p>
              <p className="text-sm text-muted-foreground">Thu, Mar 6</p>
              <p className="font-medium">ABV</p>
            </div>
          </div>

          <div className="text-sm space-y-1">
            <p className="font-medium">British Airways 83</p>
            <p className="text-muted-foreground">Economy</p>
          </div>
        </div>


        {/* Travelers and Baggage */}
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
            <span className="font-bold">$1,332.60</span>
          </div>
        </div>

        <div className="bg-primary/5 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Price</span>
            <span className="text-2xl font-bold">$1,332.60</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">All prices quoted in US dollars</p>
        </div>
      </CardContent>
    </Card>
  )
}

const PassengerInfo = () =>{
  return (
    <CardContent className="space-y-6">
    {/* Personal Information */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First name*</Label>
        <Input id="firstName" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="middleName">Middle name</Label>
        <Input id="middleName" />
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
        <Input id="email" type="email" placeholder="Email for confirmation" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone number*</Label>
        <Input id="phone" type="tel" required />
      </div>
    </div>

    {/* Travel Documents */}
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
            {/* Add more countries */}
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
        <Input type="date" required min={new Date().toISOString().split('T')[0]} />
      </div>
    </div>
  </CardContent>
  )
}

export default function FlightBookingPage() {
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
    router.push('/flight/payment/FL123') // Replace with actual flight ID
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Left Side - Flight Summary */}
        <div className="hidden lg:block lg:col-span-4">
          <FlightSummary flight={flight} />
        </div>

        {/* Right Side - Booking Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Passenger Information */}
          <Card>
            <CardHeader>
              <CardTitle>Who's traveling?</CardTitle>
              <CardDescription>
                Names must match government-issued photo ID exactly
              </CardDescription>
            </CardHeader>
            <PassengerInfo/>
            <PassengerInfo/>
          </Card>

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
                        Yes, add protection for $127.93
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="protection-no" />
                      <Label htmlFor="protection-no" className="font-normal">
                        No, I'll risk my $1,332.60 booking
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review and Terms */}
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
                    <li>Tickets are refundable with a penalty fee of $441 for cancellations.</li>
                    <li>Name changes are not permitted. Ensure all details match your ID.</li>
                    <li>Baggage fees may apply and vary by airline.</li>
                    <li>Fares are not guaranteed until ticketed.</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="flex items-start space-x-2">
                <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => setAcceptTerms(checked as boolean)} />
                <Label htmlFor="terms" className="text-sm">
                  I acknowledge that I have reviewed the Privacy Statement, Government Travel Advice, 
                  and have reviewed and accept the Rules & Restrictions and Terms of Use.
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                Back
              </Button>
              <Button 
                onClick={handleProceedToPayment} 
                disabled={isLoading || !acceptTerms || addProtection === null}
                className="w-40"
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