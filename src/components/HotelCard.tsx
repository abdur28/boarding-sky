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
    if (offer.provider === 'direct') {
      const params = new URLSearchParams({
        offerId: offer.id,
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
        adults: searchParams.adults.toString()
      });

      router.push(`/hotel/booking?${params.toString()}`);
      return;
    }

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
    <Card className="w-full max-w-6xl md:h-[370px] overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Image Section - Edge to edge */}
          <div className="relative w-full md:w-2/5 h-[370px]">
            <Carousel className="w-full h-full">
              <CarouselContent>
                {offer.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full h-[370px]">
                      <img
                        src={image.thumbnail}
                        alt={`${offer.name} - Image ${index + 1}`}
                        className="absolute inset-0 object-cover w-full h-full"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>

          {/* Content Section */}
          <div className="flex-1  p-3">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{offer.name}</h3>
                <p className="text-blue-600 text-sm">{offer.location.address}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {offer.amenities.slice(0, 3).map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100 text-xs text-gray-600 hover:bg-gray-100">
                    {amenity}
                  </Badge>
                ))}
                {offer.amenities.length > 3 && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-100">
                    +{offer.amenities.length - 3} more
                  </Badge>
                )}
              </div>

              <p className="text-xs text-gray-600">{offer.description.length > 100 ? offer.description.slice(0, 100) + '...' : offer.description }</p>

              {offer.refundable && (
                <div className="space-y-1">
                  <p className="text-green-600 text-sm font-medium">Fully refundable</p>
                  <p className="text-xs text-gray-600">Reserve now, pay later</p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600 hover:bg-green-600 p-1 ">
                    {offer.rating.overall.toFixed(1)}
                  </Badge>
                  <div>
                    <span className="font-medium text-sm">
                      {offer.rating.overall >= 9 ? 'Exceptional' :
                       offer.rating.overall >= 8 ? 'Excellent' :
                       offer.rating.overall >= 7 ? 'Very Good' :
                       offer.rating.overall >= 6 ? 'Good' : 'Fair'}
                    </span>
                    <p className="text-xs text-gray-600">{offer.rating.totalReviews} reviews</p>
                  </div>
                </div>

                <div className="ml-auto text-right">
                  {offer.price.discount && (
                    <Badge variant="secondary" className="mb-1 bg-slate-900 text-white text-xs hover:bg-slate-900">
                      {offer.price.discount.label} ${offer.price.discount.amount} off
                    </Badge>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center justify-end gap-2">
                      {offer.price.original && (
                        <span className="text-xs line-through">
                          ${offer.price.original}
                        </span>
                      )}
                      <span className="text-xl font-bold">
                        ${offer.price.current}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {offer.price.includesTaxes ? 'includes taxes & fees' : 'plus taxes & fees'}
                    </p>
                  </div>
                  <div className="mt-2">
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