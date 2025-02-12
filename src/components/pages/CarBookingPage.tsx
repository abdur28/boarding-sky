'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Car, MapPin, Calendar, Shield, Users, Radio, Wind, Gauge, Fuel, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '../ui/badge'

const CarSummary = () => {
  return (
    <Card className="lg:sticky lg:top-20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Fullsize</CardTitle>
            <CardDescription>Chevrolet Malibu or similar</CardDescription>
          </div>
          <Badge variant="secondary">Great Deal</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Car Features */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>5 Passengers</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4" />
            <span>Air Conditioning</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            <span>Unlimited mileage</span>
          </div>
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            <span>4 Doors</span>
          </div>
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4" />
            <span>Automatic</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4" />
            <span>Fuel: full to full</span>
          </div>
        </div>

        {/* Rental Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <div className="text-sm">
              <p>Wed, Feb 26, 10:30am -</p>
              <p>Thu, Feb 27, 10:30am</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <p className="text-sm">1 Northside Piers, Brooklyn, New York</p>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Car rental fee (1 day)</span>
            <span>$32.64</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Taxes and fees</span>
            <span>$6.81</span>
          </div>
 
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>$39.45</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Pay now: $32.64</p>
            <p>Pay at pick-up: $6.81</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CarBookingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])

  const extras = [
    { id: 'booster', name: 'Booster Seat', price: 17 },
    { id: 'toddler', name: 'Toddler Seat', price: 17 },
    { id: 'infant', name: 'Infant Seat', price: 17 },
    { id: 'satellite', name: 'Satellite Radio', price: 8 },
  ]

  const handleProceed = async () => {
    if (!acceptTerms) {
      alert("Please accept the terms and conditions")
      return
    }

    setIsLoading(true)
    try {
      // Here you would make an API call to create the booking
      await new Promise(resolve => setTimeout(resolve, 1500))
      router.push('/car/payment/CAR123')
    } catch (error) {
      console.error('Booking failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Left Side - Car Summary */}
        <div className="pb-6 lg:pb-0 lg:col-span-4">
          <CarSummary />
        </div>

        {/* Right Side - Booking Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Insurance Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Rental Car Insurance
              </CardTitle>
              <CardDescription>Protect your rental with comprehensive coverage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-1" />
                  <span>Covers certain bumps, scratches, and other damage</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-1" />
                  <span>Helps protect your rental vehicle in case of an accident or collision</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-1" />
                  <span>Gives you access to 24/7 emergency travel assistance</span>
                </div>
              </div>
              <Alert>
                <AlertDescription>
                  Add the insurance plan to your rental car on the next step.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Extra Options */}
          <Card>
            <CardHeader>
              <CardTitle>Extra Options</CardTitle>
              <CardDescription>
                Add extra items to your rental. Requests subject to availability.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {extras.map((extra) => (
                  <div key={extra.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={extra.id}
                        checked={selectedExtras.includes(extra.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedExtras([...selectedExtras, extra.id])
                          } else {
                            setSelectedExtras(selectedExtras.filter(id => id !== extra.id))
                          }
                        }}
                      />
                      <Label htmlFor={extra.id}>{extra.name}</Label>
                    </div>
                    <span className="font-medium">${extra.price}/day</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rental Policies */}
          <Card>
            <CardHeader>
              <CardTitle>Rental Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Cancellation and no-show policy</h4>
                  <p className="text-sm text-muted-foreground">
                    Cancellation available with fee of $100
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Age surcharge</h4>
                  <p className="text-sm text-muted-foreground">
                    Applicable for drivers under 25 years
                  </p>
                </div>
              </div>

              <Alert>
                <AlertTitle>Important Information</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4 space-y-2 text-sm">
                    <li>Valid driver's license required at pick-up</li>
                    <li>Credit card in main driver's name required</li>
                    <li>Fuel policy: Full to Full</li>
                    <li>Age restrictions apply</li>
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
                  I acknowledge that I have reviewed and accept the rental terms,
                  cancellation policy, and rental requirements.
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                Back
              </Button>
              <Button 
                onClick={handleProceed} 
                disabled={isLoading || !acceptTerms}
                className="min-w-[200px]"
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