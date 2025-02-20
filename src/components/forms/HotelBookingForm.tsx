import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

interface GuestInfo {
  firstName: string
  lastName: string
  age?: number
}

interface HotelBookingFormProps {
  onFormChange: (isValid: boolean, formData: any) => void
  numberOfRooms: number
  numberOfGuests: number
}

export function HotelBookingForm({ onFormChange, numberOfRooms, numberOfGuests }: HotelBookingFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    guests: Array(Math.max(0, numberOfGuests - 1)).fill({
      firstName: '',
      lastName: '',
      age: undefined
    }) as GuestInfo[],
  })
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    const newFormData = {
      ...formData,
      [field]: value
    }
    setFormData(newFormData)
    validateAndUpdateForm(newFormData, acceptTerms)
  }

  const handleGuestInfoChange = (index: number, field: string, value: string | number) => {
    const newGuests = [...formData.guests]
    newGuests[index] = {
      ...newGuests[index],
      [field]: value
    }
    
    const newFormData = {
      ...formData,
      guests: newGuests
    }
    
    setFormData(newFormData)
    validateAndUpdateForm(newFormData, acceptTerms)
  }

  const handleTermsChange = (checked: boolean) => {
    setAcceptTerms(checked)
    validateAndUpdateForm(formData, checked)
  }

  const validateAndUpdateForm = (data: typeof formData, terms: boolean) => {
    // Validate main guest info
    const isMainGuestValid = 
      data.firstName !== '' &&
      data.lastName !== '' &&
      data.email !== '' &&
      data.phone !== ''

    // Validate all additional guests
    const areAllGuestsValid = data.guests.every(guest => 
      guest.firstName !== '' && 
      guest.lastName !== ''
    )

    const isValid = isMainGuestValid && areAllGuestsValid && terms

    onFormChange(isValid, {
      ...data,
      numberOfRooms,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Main Guest Information</CardTitle>
          <CardDescription>
            Details of the person making the booking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name*</Label>
              <Input 
                id="firstName" 
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name*</Label>
              <Input 
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address*</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Email for confirmation"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number*</Label>
              <Input 
                id="phone" 
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Guests */}
      {numberOfGuests > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Guests</CardTitle>
            <CardDescription>
              Information for all staying guests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.guests.map((guest, index) => (
              <div key={index} className="space-y-4 pb-4 border-b last:border-0">
                <h4 className="font-medium">Guest {index + 2}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First name*</Label>
                    <Input 
                      value={guest.firstName}
                      onChange={(e) => handleGuestInfoChange(index, 'firstName', e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last name*</Label>
                    <Input 
                      value={guest.lastName}
                      onChange={(e) => handleGuestInfoChange(index, 'lastName', e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/3">
                  <Label>Age</Label>
                  <Input 
                    type="number"
                    min="0"
                    max="120"
                    value={guest.age || ''}
                    onChange={(e) => handleGuestInfoChange(index, 'age', parseInt(e.target.value))}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Special Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Special Requests</CardTitle>
          <CardDescription>
            Let us know if you have any special requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="e.g., room preferences, accessibility needs, or any other requests"
            value={formData.specialRequests}
            onChange={(e) => handleInputChange('specialRequests', e.target.value)}
            className="h-32"
          />
        </CardContent>
      </Card>

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
                <li>Check-in time starts at 3 PM</li>
                <li>Check-out time is 12 PM</li>
                <li>Photo identification required at check-in</li>
                <li>Credit card required for incidental charges</li>
                <li>No pets allowed (service animals welcome)</li>
                <li>Non-smoking property</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              checked={acceptTerms} 
              onCheckedChange={(checked) => handleTermsChange(checked as boolean)} 
            />
            <Label htmlFor="terms" className="text-sm">
              I confirm that I am at least 18 years old and I have read and accept the booking <Link href="/terms-and-conditions" target="_blank" 
              className="underline text-first hover:text-second">terms and conditions, including the cancellation and no-show policy.</Link> I am booking for all guests listed 
              and have their permission to share their personal information.
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}