'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Wifi, Tv, Coffee, UtensilsCrossed, Car, Bath, Loader2, Users } from "lucide-react"
import Image from "next/image"

// Example hotel data
const HOTEL_DATA = {
  id: "HTL123",
  name: "Grand Plaza Hotel",
  location: "Downtown London",
  rating: 4.5,
  description: "Located in the heart of the city, Grand Plaza Hotel offers luxury accommodations with stunning city views.",
  amenities: [
    { icon: Wifi, name: "Free WiFi" },
    { icon: Tv, name: "Smart TV" },
    { icon: Coffee, name: "Coffee Maker" },
    { icon: UtensilsCrossed, name: "Restaurant" },
    { icon: Car, name: "Parking" },
    { icon: Bath, name: "Spa" }
  ],
  images: [
    "/placeholder-image.png",
    "/placeholder-image.png",
    "/placeholder-image.png",
    "/placeholder-image.png"
  ],
  rooms: [
    {
      id: "RM101",
      name: "Deluxe Room",
      size: "32 sqm",
      beds: "1 King Bed",
      occupancy: 2,
      amenities: ["City View", "Air Conditioning", "Mini Bar", "Safe"],
      price: 200,
      availability: 5,
      images: ["/placeholder-image.png"]
    },
    {
      id: "RM102",
      name: "Executive Suite",
      size: "48 sqm",
      beds: "1 King Bed + 1 Sofa Bed",
      occupancy: 3,
      amenities: ["City View", "Air Conditioning", "Mini Bar", "Safe", "Living Area"],
      price: 350,
      availability: 3,
      images: ["/placeholder-image.png"]
    },
    {
      id: "RM103",
      name: "Family Room",
      size: "55 sqm",
      beds: "2 Queen Beds",
      occupancy: 4,
      amenities: ["Garden View", "Air Conditioning", "Mini Bar", "Safe", "Balcony"],
      price: 400,
      availability: 2,
      images: ["/placeholder-image.png"]
    }
  ],
  policies: {
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
    cancellation: "Free cancellation up to 24 hours before check-in",
    children: "Children of all ages are welcome",
    pets: "Pets are not allowed"
  }
}

interface RoomSelectionProps {
  checkIn: string
  checkOut: string
  guests: number
  rooms: number
}

export default function RoomSelectionPage({ checkIn, checkOut, guests, rooms }: RoomSelectionProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

  const handleBookRoom = (roomId: string) => {
    setIsLoading(true)
    // In real app, validate availability again before proceeding
    router.push(`/hotel/booking/${roomId}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&rooms=${rooms}`)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hotel Details */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{HOTEL_DATA.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(Math.floor(HOTEL_DATA.rating))].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
                {HOTEL_DATA.rating % 1 > 0 && (
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                )}
              </div>
              <span className="text-muted-foreground">{HOTEL_DATA.location}</span>
            </div>
            <p className="text-muted-foreground">{HOTEL_DATA.description}</p>
          </div>

          {/* Hotel Images */}
          <div className="grid grid-cols-2 gap-4">
            {HOTEL_DATA.images.map((image, index) => (
              <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`${HOTEL_DATA.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Hotel Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {HOTEL_DATA.amenities.map((amenity, index) => {
                  const Icon = amenity.icon
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <span>{amenity.name}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Policies */}
          <Card>
            <CardHeader>
              <CardTitle>Hotel Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Check-in/Check-out</p>
                  <p className="text-sm text-muted-foreground">Check-in: {HOTEL_DATA.policies.checkIn}</p>
                  <p className="text-sm text-muted-foreground">Check-out: {HOTEL_DATA.policies.checkOut}</p>
                </div>
                <div>
                  <p className="font-medium">Cancellation Policy</p>
                  <p className="text-sm text-muted-foreground">{HOTEL_DATA.policies.cancellation}</p>
                </div>
                <div>
                  <p className="font-medium">Children</p>
                  <p className="text-sm text-muted-foreground">{HOTEL_DATA.policies.children}</p>
                </div>
                <div>
                  <p className="font-medium">Pets</p>
                  <p className="text-sm text-muted-foreground">{HOTEL_DATA.policies.pets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Rooms */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>
          {HOTEL_DATA.rooms.map((room) => (
            <Card key={room.id} className={`transition-shadow hover:shadow-md ${selectedRoom === room.id ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader>
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <Image
                    src={room.images[0]}
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardTitle>{room.name}</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Up to {room.occupancy} guests</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Room Details</p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <p>Size: {room.size}</p>
                      <p>Beds: {room.beds}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Room Amenities</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {room.amenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary">{amenity}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">${room.price}</p>
                      <p className="text-sm text-muted-foreground">per night</p>
                    </div>
                    <Button 
                      onClick={() => handleBookRoom(room.id)}
                      disabled={isLoading || room.availability === 0}
                    >
                      {isLoading && selectedRoom === room.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        room.availability === 0 ? 'Sold Out' : 'Book Now'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}