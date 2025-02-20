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
import Link from "next/link"

interface DriverFormProps {
  onFormChange: (isValid: boolean, formData: any) => void
}

export function CarBookingForm({ onFormChange }: DriverFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    licenseNumber: '',
    birthDate: undefined as Date | undefined,
    licenseExpiry: undefined as Date | undefined,
  })
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    const newFormData = {
      ...formData,
      [field]: value
    }
    setFormData(newFormData)
    
    // Validate and update form after state change
    const isValid = 
      newFormData.firstName !== '' &&
      newFormData.lastName !== '' &&
      newFormData.email !== '' &&
      newFormData.phone !== '' &&
      newFormData.country !== '' &&
      newFormData.licenseNumber !== '' &&
      newFormData.birthDate !== undefined &&
      newFormData.licenseExpiry !== undefined &&
      acceptTerms

    const apiFormData = {
      ...newFormData,
      birthDate: newFormData.birthDate ? format(newFormData.birthDate, 'yyyy-MM-dd') : '',
      licenseExpiry: newFormData.licenseExpiry ? format(newFormData.licenseExpiry, 'yyyy-MM-dd') : ''
    }

    onFormChange(isValid, apiFormData)
  }

  const handleTermsChange = (checked: boolean) => {
    setAcceptTerms(checked)
    
    // Validate and update form after terms change
    const isValid = 
      formData.firstName !== '' &&
      formData.lastName !== '' &&
      formData.email !== '' &&
      formData.phone !== '' &&
      formData.country !== '' &&
      formData.licenseNumber !== '' &&
      formData.birthDate !== undefined &&
      formData.licenseExpiry !== undefined &&
      checked

    const apiFormData = {
      ...formData,
      birthDate: formData.birthDate ? format(formData.birthDate, 'yyyy-MM-dd') : '',
      licenseExpiry: formData.licenseExpiry ? format(formData.licenseExpiry, 'yyyy-MM-dd') : ''
    }

    onFormChange(isValid, apiFormData)
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Select date"
    return format(date, 'MMM dd, yyyy')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Driver Information</CardTitle>
          <CardDescription>
            Details must match your driving license exactly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label htmlFor="middleName">Middle name</Label>
              <Input 
                id="middleName"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Country of Issue*</Label>
              <Select onValueChange={(value) => handleInputChange('country', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Driver's License Number*</Label>
              <Input 
                value={formData.licenseNumber}
                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                required 
              />
            </div>
          </div>

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
                    {formatDate(formData.birthDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.birthDate}
                    onSelect={(date) => handleInputChange('birthDate', date)}
                    defaultMonth={formData.birthDate || new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                    initialFocus
                    disabled={(date) => 
                      date > new Date() || 
                      date > new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>License Expiry Date*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(formData.licenseExpiry)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.licenseExpiry}
                    onSelect={(date) => handleInputChange('licenseExpiry', date)}
                    defaultMonth={formData.licenseExpiry}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

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
                <li>Valid driver's license required at pickup</li>
                <li>Minimum age requirements apply</li>
                <li>Credit card in driver's name required</li>
                <li>Fuel policy: Return with same level</li>
                <li>Mileage restrictions may apply</li>
                <li>Local taxes and fees may apply</li>
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
              I confirm that I am at least 21 years old and have held my license for at least one year. 
              I have reviewed and accept <Link href="/terms-and-conditions" target="_blank" 
              className="underline text-first hover:text-second">the rental terms and conditions, including the cancellation policy.</Link>
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}