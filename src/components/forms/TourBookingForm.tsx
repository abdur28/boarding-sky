'use client'

import { useState, useEffect } from "react"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

const formSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    adults: z.number().min(1, "At least 1 adult is required"),
    children: z.number().min(0),
    agreeToTerms: z.boolean().refine(val => val === true, {
        message: "You must agree to the terms and conditions"
    })
});

interface TourBookingFormProps {
    onFormChange: (isValid: boolean, data: any) => void;
}

export function TourBookingForm({ onFormChange }: TourBookingFormProps) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        adults: 1,
        children: 0,
        agreeToTerms: false
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    
    const validateForm = () => {
        try {
            formSchema.parse(formData);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: { [key: string]: string } = {};
                error.errors.forEach((err) => {
                    if (err.path) {
                        newErrors[err.path.join('.')] = err.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    useEffect(() => {
        const isValid = validateForm();
        onFormChange(isValid, formData);
    }, [formData]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="space-y-6">
            {/* Contact Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className={errors.firstName ? 'border-red-500' : ''}
                            />
                            {errors.firstName && (
                                <p className="text-sm text-red-500">{errors.firstName}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                className={errors.lastName ? 'border-red-500' : ''}
                            />
                            {errors.lastName && (
                                <p className="text-sm text-red-500">{errors.lastName}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className={errors.phone ? 'border-red-500' : ''}
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-500">{errors.phone}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Number of Participants */}
            <Card>
                <CardHeader>
                    <CardTitle>Number of Participants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="adults">Adults *</Label>
                            <Select
                                value={formData.adults.toString()}
                                onValueChange={(value) => handleInputChange('adults', parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select number of adults" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                        <SelectItem key={num} value={num.toString()}>
                                            {num} {num === 1 ? 'Adult' : 'Adults'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.adults && (
                                <p className="text-sm text-red-500">{errors.adults}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="children">Children (Ages 2-12)</Label>
                            <Select
                                value={formData.children.toString()}
                                onValueChange={(value) => handleInputChange('children', parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select number of children" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[0, 1, 2, 3, 4].map((num) => (
                                        <SelectItem key={num} value={num.toString()}>
                                            {num} {num === 1 ? 'Child' : 'Children'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start space-x-2">
                        <Checkbox
                            id="terms"
                            checked={formData.agreeToTerms}
                            onCheckedChange={(checked) => 
                                handleInputChange('agreeToTerms', checked)
                            }
                            className="mt-1"
                        />
                        <div className="space-y-1">
                            <Label
                                htmlFor="terms"
                                className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                By checking this box, I agree to the{" "}
                                <Link 
                                    href="/terms-and-conditions" 
                                    className="text-first hover:text-second underline"
                                    target="_blank"
                                >
                                    Terms & Conditions
                                </Link>
                                {" "}and{" "}
                                <Link
                                    href="/privacy-policy" 
                                    className="text-first hover:text-second underline"
                                    target="_blank"
                                >
                                    Privacy Policy
                                </Link>
                            </Label>
                            {errors.agreeToTerms && (
                                <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Form Validation Alert */}
            {Object.keys(errors).length > 0 && (
                <Alert variant="destructive">
                    <AlertDescription>
                        Please fill in all required fields correctly before proceeding.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}