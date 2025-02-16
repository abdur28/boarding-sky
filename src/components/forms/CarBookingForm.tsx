'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

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
    birthMonth: '',
    birthDay: '',
    birthYear: '',
    licenseExpiry: '',
  })
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  useEffect(() => {
    const isValid = 
      formData.firstName !== '' &&
      formData.lastName !== '' &&
      formData.email !== '' &&
      formData.phone !== '' &&
      formData.country !== '' &&
      formData.licenseNumber !== '' &&
      formData.birthMonth !== '' &&
      formData.birthDay !== '' &&
      formData.birthYear !== '' &&
      formData.licenseExpiry !== '' &&
      acceptTerms

    onFormChange(isValid, formData)
  }, [formData, acceptTerms, onFormChange])

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
              <div className="grid grid-cols-3 gap-2">
                <Select onValueChange={(value) => handleInputChange('birthMonth', value)}>
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
                <Select onValueChange={(value) => handleInputChange('birthDay', value)}>
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
                <Select onValueChange={(value) => handleInputChange('birthYear', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 70}, (_, i) => {
                      const year = new Date().getFullYear() - i - 18
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
              <Label>License Expiry Date*</Label>
              <Input 
                type="date" 
                value={formData.licenseExpiry}
                onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                min={new Date().toISOString().split('T')[0]} 
                required 
              />
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
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)} 
            />
            <Label htmlFor="terms" className="text-sm">
              I confirm that I am at least 21 years old and have held my license for at least one year. 
              I have reviewed and accept the rental terms and conditions, including the cancellation policy.
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}