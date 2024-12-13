'use client'

import { Heart } from 'lucide-react'
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface HotelCardProps {
  name: string
  location: string
  description: string
  images: string[]
  amenities: string[]
  rating: {
    score: number
    reviews: number
  }
  pricing: any
  badges?: string[]
  refundable?: boolean
}

export function HotelCard({
  name = "Gale Miami Hotel and Residences",
  location = "Downtown Miami",
  description = "Retreat to spacious rooms & condo-style suites with world-class amenities including our gym, spa, terrace pool, and restaurants.",
  images = [
    "/placeholder.svg?height=200&width=400",
    "/placeholder.svg?height=200&width=400",
  ],
  amenities = ["Pool"],
  rating = {
    score: 8.6,
    reviews: 139
  },
  pricing = {
    original: 407,
    current: 326,
    discount: {
      label: "Black Friday",
      amount: 81
    }
  },
  refundable = false
}: HotelCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <Card className="w-full max-w-6xl overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-4 h-full w-full justify-center items-center">
          <div className="w-full md:w-[500px] md:h-[300px] h-[300px] ">
            <Carousel className="w-full h-full flex justify-center items-center overflow-hidden">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="h-full w-full">
                      <img
                        src={image}
                        alt={`${name} - Image ${index + 1}`}
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
                <h3 className="text-xl font-semibold">{name}</h3>
                <p className="text-blue-600">{location}</p>
              </div>

              <div className="flex gap-2">
                {amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-100">
                    {amenity}
                  </Badge>
                ))}
              </div>

              <p className="text-sm text-gray-600">{description}</p>

              {refundable && (
                <div className="space-y-1">
                  <p className="text-green-600 font-medium">Fully refundable</p>
                  <p className="text-sm text-gray-600">Reserve now, pay later</p>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600 hover:bg-green-600 p-2">
                    {rating === null ? '9.6' : rating.score}
                  </Badge>
                  <div>
                    <span className="font-medium">Excellent</span>
                    <p className="text-sm text-gray-600">{rating === null ? '1390' : rating.reviews} reviews</p>
                  </div>
                </div>

                <div className="ml-auto text-right">
                  {pricing.discount && (
                    <Badge variant="secondary" className="mb-1 bg-slate-900 text-white hover:bg-slate-900">
                      {pricing.discount.label} ${pricing.discount.amount} off
                    </Badge>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm line-through">${pricing.total}</span>
                      <span className="text-2xl font-bold">${pricing.total}</span>
                    </div>
                    <p className="text-sm text-gray-600">includes taxes & fees</p>
                  </div>
                  <div className='mt-4'>
                  <Button >Book Now</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}