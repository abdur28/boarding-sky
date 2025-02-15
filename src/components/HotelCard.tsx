'use client'

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { HotelOffer } from "@/types"
import { useRouter } from "next/navigation"

interface HotelCardProps {
  offer: HotelOffer;
  searchParams?: {
    checkIn: string;
    checkOut: string;
    adults: number;
  };
}

export function HotelCard({ 
  offer,
  searchParams = {
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    adults: 2
  }
}: HotelCardProps) {
  const router = useRouter();

  const handleBooking = () => {
    if (!offer.propertyToken) {
      console.error('No property token available');
      return;
    }

    const params = new URLSearchParams({
        propertyToken: offer.propertyToken,
        q: offer.name,
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
        adults: searchParams.adults.toString()
    });

    router.push(`/hotel/booking?${params.toString()}`);
  };

  return (
    <Card className="w-full max-w-6xl overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-4 h-full w-full justify-center items-center">
          <div className="w-full md:w-[500px] md:h-[300px] h-[300px]">
            <Carousel className="w-full h-full flex justify-center items-center overflow-hidden">
              <CarouselContent>
                {offer.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="h-full w-full">
                      <img
                        src={image.thumbnail}
                        alt={`${offer.name} - Image ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>

          <div className="flex flex-col p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{offer.name}</h3>
                <p className="text-blue-600">{offer.location.address}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {offer.amenities.slice(0, 3).map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-100">
                    {amenity}
                  </Badge>
                ))}
                {offer.amenities.length > 3 && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-100">
                    +{offer.amenities.length - 3} more
                  </Badge>
                )}
              </div>

              <p className="text-sm text-gray-600">{offer.description}</p>

              {offer.refundable && (
                <div className="space-y-1">
                  <p className="text-green-600 font-medium">Fully refundable</p>
                  <p className="text-sm text-gray-600">Reserve now, pay later</p>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600 hover:bg-green-600 p-2">
                    {offer.rating.overall.toFixed(1)}
                  </Badge>
                  <div>
                    <span className="font-medium">
                      {offer.rating.overall >= 9 ? 'Exceptional' :
                       offer.rating.overall >= 8 ? 'Excellent' :
                       offer.rating.overall >= 7 ? 'Very Good' :
                       offer.rating.overall >= 6 ? 'Good' : 'Fair'}
                    </span>
                    <p className="text-sm text-gray-600">{offer.rating.totalReviews} reviews</p>
                  </div>
                </div>

                <div className="ml-auto text-right">
                  {offer.price.discount && (
                    <Badge variant="secondary" className="mb-1 bg-slate-900 text-white hover:bg-slate-900">
                      {offer.price.discount.label} ${offer.price.discount.amount} off
                    </Badge>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center justify-end gap-2">
                      {offer.price.original && (
                        <span className="text-sm line-through">
                          ${offer.price.original}
                        </span>
                      )}
                      <span className="text-2xl font-bold">
                        ${offer.price.current}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {offer.price.includesTaxes ? 'includes taxes & fees' : 'plus taxes & fees'}
                    </p>
                  </div>
                  <div className='mt-4'>
                    <Button onClick={handleBooking}>Book Now</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}