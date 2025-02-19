'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

interface PassengerInfo {
  type: 'adult' | 'child' | 'infant'
  firstName: string
  lastName: string
  nationality: string
  passportNumber: string
  dateOfBirth: Date | undefined
  passportExpiry: Date | undefined
}

interface FlightBookingFormProps {
  onFormChange: (isValid: boolean, formData: any) => void
  passengerTypes: Array<'adult' | 'child' | 'infant'>
}

export function FlightBookingForm({ onFormChange, passengerTypes }: FlightBookingFormProps) {
  const [formData, setFormData] = useState({
    passengers: passengerTypes.map(type => ({
      type,
      firstName: '',
      lastName: '',
      nationality: '',
      passportNumber: '',
      dateOfBirth: undefined,
      passportExpiry: undefined
    })) as PassengerInfo[],
    email: '',
    phone: '',
    acceptTerms: false
  })

  const handleInputChange = (index: number, field: string, value: string | Date | undefined) => {
    const newPassengers = [...formData.passengers]
    newPassengers[index] = {
      ...newPassengers[index],
      [field]: value
    }

    const newFormData = {
      ...formData,
      passengers: newPassengers
    }
    
    setFormData(newFormData)
    validateAndUpdateForm(newFormData)
  }

  const handleContactChange = (field: string, value: string) => {
    const newFormData = {
      ...formData,
      [field]: value
    }
    setFormData(newFormData)
    validateAndUpdateForm(newFormData)
  }

  const handleTermsChange = (checked: boolean) => {
    const newFormData = {
      ...formData,
      acceptTerms: checked
    }
    setFormData(newFormData)
    validateAndUpdateForm(newFormData)
  }

  const validateAndUpdateForm = (data: typeof formData) => {
    // Validate all passengers
    const areAllPassengersValid = data.passengers.every(passenger => 
      passenger.firstName !== '' &&
      passenger.lastName !== '' &&
      passenger.nationality !== '' &&
      passenger.passportNumber !== '' &&
      passenger.dateOfBirth !== undefined &&
      passenger.passportExpiry !== undefined
    )

    // Validate contact information
    const isContactValid = data.email !== '' && data.phone !== ''

    const isValid = areAllPassengersValid && isContactValid && data.acceptTerms

    // Format dates for API
    const formattedData = {
      ...data,
      passengers: data.passengers.map(passenger => ({
        ...passenger,
        dateOfBirth: passenger.dateOfBirth ? format(passenger.dateOfBirth, 'yyyy-MM-dd') : '',
        passportExpiry: passenger.passportExpiry ? format(passenger.passportExpiry, 'yyyy-MM-dd') : ''
      }))
    }

    onFormChange(isValid, formattedData)
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Select date"
    return format(date, 'MMM dd, yyyy')
  }

  return (
    <div className="space-y-6">
      {formData.passengers.map((passenger, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>
              Passenger {index + 1} ({passenger.type.charAt(0).toUpperCase() + passenger.type.slice(1)})
            </CardTitle>
            <CardDescription>
              Details must match your passport exactly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First name*</Label>
                <Input 
                  value={passenger.firstName}
                  onChange={(e) => handleInputChange(index, 'firstName', e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Last name*</Label>
                <Input 
                  value={passenger.lastName}
                  onChange={(e) => handleInputChange(index, 'lastName', e.target.value)}
                  required 
                />
              </div>
            </div>

            {/* Passport Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nationality*</Label>
                <Select 
                  value={passenger.nationality} 
                  onValueChange={(value) => handleInputChange(index, 'nationality', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Passport Number*</Label>
                <Input 
                  value={passenger.passportNumber}
                  onChange={(e) => handleInputChange(index, 'passportNumber', e.target.value)}
                  required 
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date of birth*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDate(passenger.dateOfBirth)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={passenger.dateOfBirth}
                      onSelect={(date) => handleInputChange(index, 'dateOfBirth', date)}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Passport Expiry Date*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDate(passenger.passportExpiry)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={passenger.passportExpiry}
                      onSelect={(date) => handleInputChange(index, 'passportExpiry', date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Contact Information (only for first passenger) */}
            {index === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email address*</Label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    placeholder="Email for confirmation"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone number*</Label>
                  <Input 
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    required 
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Terms and Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important Information</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-4 space-y-2 text-sm">
                <li>Valid passport required for international travel</li>
                <li>Passport must be valid for at least 6 months beyond travel dates</li>
                <li>Name changes are not permitted after booking</li>
                <li>Check visa requirements for your destination</li>
                <li>Baggage fees may apply</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              checked={formData.acceptTerms} 
              onCheckedChange={(checked) => handleTermsChange(checked as boolean)} 
            />
            <Label htmlFor="terms" className="text-sm">
              I confirm that all passenger information is correct and matches their passport exactly. 
              I have reviewed and accept the booking terms and conditions, including the fare rules and cancellation policy.
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}