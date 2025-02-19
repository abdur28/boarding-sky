'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2, Shield, Calendar, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CarOffer } from "@/types"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useRouter } from "next/navigation"
import { CarBookingForm } from "@/components/forms/CarBookingForm"
import { useCar } from "@/hooks/useCar"

interface CarBookingPageProps {
    offerId: string
    pickupDate: string
    dropoffDate: string
    pickupTime: string
    dropoffTime: string
    pickupLocation: string
    dropoffLocation: string
    provider: string
}

const CarBookingPage = ({
    offerId,
    pickupDate,
    dropoffDate,
    pickupLocation,
    dropoffLocation,
    pickupTime,
    dropoffTime,
    provider
}: CarBookingPageProps) => {
    const router = useRouter()
    const { carOffer, isLoading: stateLoading, error: stateError, getCarOffer } = useCar()
    const [isFormValid, setIsFormValid] = useState(false)
    const [formData, setFormData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const formatDateTime = (date: string, time: string) => {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        return `${formattedDate}, ${time}`;
    };

    useEffect(() => {
        if (offerId) {
            getCarOffer({
                offerId,
                pickUpLocation: pickupLocation,
                dropOffLocation: dropoffLocation,
                pickUpDate: pickupDate,
                dropOffDate: dropoffDate,
                pickUpTime: pickupTime,
                dropOffTime: dropoffTime,
                provider
            })
        }
    }, [offerId, pickupLocation, dropoffLocation, pickupDate, dropoffDate, pickupTime, dropoffTime, provider])


    
    const handleFormChange = (isValid: boolean, data: any) => {
        setIsFormValid(isValid)
        setFormData(data)
    }

    // Updated handleBookNow function for CarBookingPage
    const handleBookNow = async () => {
        if (!carOffer || !isFormValid || !formData) return;
        setIsLoading(true);

        try {
            const response = await fetch('/api/payment/checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingType: 'car',
                    offer: carOffer,
                    price: carOffer.price.amount,
                    bookingDetails: {
                        // Base booking details
                        email: formData.email,
                        phone: formData.phone,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        middlName: formData.middleName,

                        
                        // Car specific details
                        pickupDate,
                        dropoffDate,
                        pickupTime,
                        dropoffTime,
                        pickupLocation,
                        dropoffLocation,
                        licenseNumber: formData.licenseNumber,
                        dateOfBirth: formData.birthDate,
                    },
                    provider: carOffer.provider
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('Invalid checkout session response');
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error instanceof Error ? error.message : 'Failed to process payment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || stateLoading) return <LoadingState />
    if (error || stateError) return <ErrorState message={error || 'Failed to fetch car offer'} />
    if (!carOffer) return <NoDataState />

    return (
        <div className="w-full max-w-7xl px-5 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Car Images */}
                    <Card>
                        <CardContent className="p-6">
                            <Carousel className="w-full h-[400px]">
                                <CarouselContent>
                                    {carOffer.images.map((image, index) => (
                                        <CarouselItem key={index}>
                                            <img
                                                src={image.url}
                                                alt={image.alt || `${carOffer.name} - Image ${index + 1}`}
                                                className="w-full h-[400px] object-cover rounded-lg"
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </CardContent>
                    </Card>

                    {/* Booking Form */}
                    <CarBookingForm onFormChange={handleFormChange} />
                </div>

                {/* Price Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-20">
                        <CardHeader>
                            <CardTitle>Rental Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                {/* Car Details */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">{carOffer.name}</h3>
                                        <p className="text-sm text-muted-foreground">{carOffer.model} or similar</p>
                                    </div>
                                    {carOffer.vendor.logo && (
                                        <img 
                                            src={carOffer.vendor.logo} 
                                            alt={carOffer.vendor.name}
                                            className="h-8 object-contain" 
                                        />
                                    )}
                                </div>

                                {/* Rental Details */}
                                <div className="space-y-4 text-sm">
                                    {/* Pickup Details */}
                                    <div className="p-3 rounded-lg border">
                                        <div className="flex items-start gap-2 mb-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                                            <div>
                                                <p className="text-xs uppercase text-muted-foreground">Pickup</p>
                                                <p className="font-medium">
                                                    {formatDateTime(pickupDate, pickupTime)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                            <div>
                                                <p className="text-xs uppercase text-muted-foreground">Location</p>
                                                <p className="font-medium">{carOffer.pickupLocation.name}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dropoff Details */}
                                    <div className="p-3 rounded-lg border">
                                        <div className="flex items-start gap-2 mb-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                                            <div>
                                                <p className="text-xs uppercase text-muted-foreground">Drop-off</p>
                                                <p className="font-medium">
                                                    {formatDateTime(dropoffDate, dropoffTime)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                            <div>
                                                <p className="text-xs uppercase text-muted-foreground">Location</p>
                                                <p className="font-medium">{carOffer.dropoffLocation.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                {carOffer.price.breakdown && (
                                    <div className="space-y-2 pt-4 border-t">
                                        <div className="flex justify-between text-sm">
                                            <span>Base Rate</span>
                                            <span>${carOffer.price.breakdown.baseRate.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Taxes & Fees</span>
                                            <span>
                                                ${(carOffer.price.breakdown.taxes + carOffer.price.breakdown.fees).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Total Price */}
                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Total Price</span>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold">
                                                ${carOffer.price.amount.toFixed(2)}
                                            </span>
                                            <p className="text-xs text-muted-foreground">
                                                {carOffer.price.includesTaxes ? 'Includes' : 'Excludes'} taxes and fees
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Book Now Button */}
                            <Button 
                                className="w-full" 
                                onClick={handleBookNow}
                                disabled={!isFormValid || isLoading}
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

                            {/* Cancellation Policy */}
                            {carOffer.cancellationPolicy?.isCancellable && (
                                <div className="flex items-center gap-2 text-green-600 text-sm">
                                    <Shield className="h-4 w-4" />
                                    <span>
                                        Free cancellation until{' '}
                                        {carOffer.cancellationPolicy.deadline}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

const LoadingState = () => (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading car rental details...</p>
    </div>
)

const ErrorState = ({ message }: { message: string }) => (
    <Alert variant="destructive" className="max-w-2xl mx-auto my-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
    </Alert>
)

const NoDataState = () => (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-semibold text-muted-foreground">No car rental data found</p>
        <p className="text-muted-foreground">Please try again with different search criteria</p>
    </div>
)

export default CarBookingPage