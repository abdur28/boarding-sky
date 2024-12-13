'use client'

import { Building2, MapPin, Ticket, Utensils } from 'lucide-react'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface TourCardProps {
  title: string
  duration: string
  image: string
  rating: number
  pickupLocation: {
    label: string
    description: string
  }
  meals: {
    count: number
    description: string
  }
  tickets: {
    label: string
    description: string
  }
  lodging: {
    label: string
    description: string
  }
  pricing: {
    perPerson: number
    total: number
  }
  preRegistration?: boolean
}

export function TourCard({
  title = "Dubai First Time Visiting",
  duration = "3 Days",
  image = "/placeholder.svg?height=300&width=400",
  rating = 5,
  pickupLocation = {
    label: "Pick-up Location:",
    description: "Luxury Car Pickup"
  },
  meals = {
    count: 3,
    description: "Localities / Your Choice"
  },
  tickets = {
    label: "All Tickets Covered:",
    description: "Experience Guides"
  },
  lodging = {
    label: "Premium Lodgings:",
    description: "Fully Equipped Rooms"
  },
  pricing = {
    perPerson: 500.00,
    total: 550.40
  },
  preRegistration = true
}: TourCardProps) {
  return (
    <Card className="w-full max-w-3xl overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-[400px]">
            <img
              src={image}
              alt={title}
              className="h-[300px] w-full object-cover"
            />
            <Badge
              className="absolute left-4 top-4 bg-white/90 text-black hover:bg-white/90"
            >
              {duration}
            </Badge>
          </div>

          <div className="flex flex-1 flex-col p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < rating ? 'fill-orange-400' : 'fill-gray-200'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
              </div>
              {preRegistration && (
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 hover:bg-blue-50"
                >
                  Pre-Registration available
                </Badge>
              )}
            </div>

            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{pickupLocation.label}</p>
                  <p className="text-sm text-gray-500">{pickupLocation.description}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Utensils className="mt-1 h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{meals.count} Meals/day:</p>
                  <p className="text-sm text-gray-500">{meals.description}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Ticket className="mt-1 h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{tickets.label}</p>
                  <p className="text-sm text-gray-500">{tickets.description}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="mt-1 h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{lodging.label}</p>
                  <p className="text-sm text-gray-500">{lodging.description}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">$ {pricing.perPerson.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">/person</span>
                </div>
                <p className="text-sm text-gray-500">Total ${pricing.total.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Email Quotes</Button>
                <Button>Select</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}