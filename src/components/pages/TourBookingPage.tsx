'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2, Shield, Calendar, MapPin, Users } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { TourBookingForm } from "@/components/forms/TourBookingForm"

interface TourBookingPageProps {
    tourAsString: string;
}

interface TourBookingDetails {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    adults: number;
    children: number;
    agreeToTerms: boolean;
    departure: string;
  }
  
  const TourBookingPage = ({
      tourAsString,
  }: TourBookingPageProps) => {
      const tour = JSON.parse(tourAsString);
      const [isFormValid, setIsFormValid] = useState(false);
      const [formData, setFormData] = useState<TourBookingDetails | null>(null);
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
  
      const handleFormChange = (isValid: boolean, data: TourBookingDetails) => {
          setIsFormValid(isValid);
          setFormData(data);
      };
  
      const calculateTotalPrice = (): number => {
        if (!formData) return tour.price;
        const adultTotal = tour.price * formData.adults;
        const childrenTotal = tour.price * formData.children * 0.5;
        return adultTotal + childrenTotal;
    };
  
      const handleBookNow = async () => {
          if (!tour || !isFormValid || !formData) return;
          setIsLoading(true);
  
          try {
              const response = await fetch('/api/payment/checkout-session', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      bookingType: 'tour',
                      offer: {
                          id: tour._id,
                          name: tour.name,
                          tourId: tour.tourId,
                          destination: tour.destination,
                          days: tour.days,
                          departure: tour.departure,
                          price: {
                              amount: calculateTotalPrice(),
                              currency: 'USD'
                          },
                          provider: 'direct'
                      },
                      price: calculateTotalPrice(),
                      bookingDetails: {
                          email: formData.email,
                          phone: formData.phone,
                          firstName: formData.firstName,
                          lastName: formData.lastName,
                          totalParticipants: formData.adults + formData.children,
                          adults: formData.adults,
                          children: formData.children,
                          departure: tour.departure,
                          agreeToTerms: formData.agreeToTerms,
                      },
                      provider: 'direct'
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
              setError(error instanceof Error ? error.message : 'Failed to process payment');
          } finally {
              setIsLoading(false);
          }
      };


      return (
        <div className="w-full max-w-7xl px-5 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Tour Images */}
                    <Card>
                        <CardContent className="p-6">
                            <Carousel className="w-full h-[400px]">
                                <CarouselContent>
                                    {tour.images.map((image: string, index: number) => (
                                        <CarouselItem key={index}>
                                            <img
                                                src={image}
                                                alt={`${tour.name} - Image ${index + 1}`}
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
                    <TourBookingForm onFormChange={handleFormChange} />
                </div>

                {/* Price Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-20">
                        <CardHeader>
                            <CardTitle>Tour Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                {/* Tour Details */}
                                <div>
                                    <h3 className="font-medium">{tour.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {tour.destination} • {tour.days} days
                                    </p>
                                </div>

                                {/* Tour Info */}
                                <div className="space-y-4 text-sm">
                                    <div className="p-3 rounded-lg border space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>Departure: {tour.departure}</span>
                                        </div>
                                        {formData && (
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span>
                                                    {formData.adults} Adults
                                                    {formData.children > 0 && `, ${formData.children} Children`}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span>{tour.destination}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                {formData && (
                                    <div className="space-y-2 pt-4 border-t">
                                        <div className="flex justify-between text-sm">
                                            <span>Adults ({formData.adults})</span>
                                            <span>${(tour.price * (formData.adults || 0)).toFixed(2)}</span>
                                        </div>
                                        {formData.children > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span>Children ({formData.children})</span>
                                                <span>${(tour.price * (formData.children || 0) * 0.5).toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Total Price */}
                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Total Price</span>
                                        <span className="text-2xl font-bold">
                                            ${typeof calculateTotalPrice() === 'number' ? 
                                                calculateTotalPrice().toFixed(2) : 
                                                '0.00'
                                            }
                                        </span>
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

                            {/* Cancellation Note */}
                            <div className="flex items-center gap-2 text-green-600 text-sm">
                                <Shield className="h-4 w-4" />
                                <span>Free cancellation up to 24 hours before the tour</span>
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TourBookingPage;