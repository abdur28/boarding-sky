'use client'

import Header from "@/components/Header"
import CarSearch from "@/components/search/CarSearch"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Car, ShieldCheck, Fuel, Clock, MapPin, BadgeCheck } from 'lucide-react'

const PromoCard = ({ 
  title, 
  description, 
  icon: Icon, 
  color 
}: { 
  title: string 
  description: string 
  icon: any
  color: string 
}) => (
  <Card className="w-full">
    <CardContent className="flex flex-row items-center gap-4 p-6">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </CardContent>
  </Card>
)

const FeaturedLocation = ({
  image,
  city,
  country,
  price,
  cars
}: {
  image: string
  city: string
  country: string
  price: number
  cars: number
}) => (
  <Card className="group cursor-pointer overflow-hidden">
    <CardContent className="p-0 relative">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={city}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="absolute bottom-0 p-4 text-white">
        <h3 className="text-lg font-semibold">{city}</h3>
        <p className="text-sm opacity-90">{country}</p>
        <div className="mt-2 flex items-center gap-2">
          <Badge className="bg-white/20 hover:bg-white/30">
            From ${price}/day
          </Badge>
          <Badge variant="outline" className="text-white border-white/40">
            {cars} cars available
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
)

const SpecialDeal = ({
  title,
  description,
  discount,
  image,
  features
}: {
  title: string
  description: string
  discount: string
  image: string
  features: string[]
}) => (
  <Card className="overflow-hidden">
    <CardContent className="p-0">
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-48 h-48 md:h-auto">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-2 right-2 bg-red-500 text-white">
            {discount} OFF
          </Badge>
        </div>
        <div className="p-6 flex-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <BadgeCheck className="w-4 h-4 text-green-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <Button className="mt-4">View Deal</Button>
        </div>
      </div>
    </CardContent>
  </Card>
)

const CarPage = () => {
  return (
    <div className="w-full h-full">
      <Header title="Search Cars" />
      
      {/* Search Section */}
      <div className="w-full  py-8">
        <div className="w-full px-5">
          <Card className="w-full max-w-6xl mx-auto z-10 relative">
            <CardContent className="p-6">
              <CarSearch />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Promo Section */}
      <div className="w-full px-5 bg-gray-50 -mt-40 pt-48 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <PromoCard
            title="Free Cancellation"
            description="Flexible bookings with no hidden fees"
            icon={ShieldCheck}
            color="bg-blue-500"
          />
          <PromoCard
            title="No Fuel Prepayment"
            description="Pay for fuel when you return the car"
            icon={Fuel}
            color="bg-green-500"
          />
          <PromoCard
            title="24/7 Support"
            description="Round-the-clock customer service"
            icon={Clock}
            color="bg-purple-500"
          />
        </div>
      </div>

      {/* Popular Locations */}
      <div className="w-full px-5 py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8">Popular Car Rental Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeaturedLocation
              image="/placeholder-image.png"
              city="New York"
              country="United States"
              price={45}
              cars={150}
            />
            <FeaturedLocation
              image="/placeholder-image.png"
              city="Los Angeles"
              country="United States"
              price={39}
              cars={120}
            />
            <FeaturedLocation
              image="/placeholder-image.png"
              city="Miami"
              country="United States"
              price={42}
              cars={90}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarPage