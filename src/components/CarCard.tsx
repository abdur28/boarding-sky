import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { CarOffer } from "@/types"
import { useRouter } from "next/navigation"
import { Car, Fuel, Users, Gauge, Shield, CreditCard } from "lucide-react"

interface CarCardProps {
  offer: CarOffer
  searchParams?: {
    pickupDateTime: string
    dropoffDateTime: string
    pickupLocation: string
    dropoffLocation?: string
  }
}

export function CarCard({ 
  offer,
  searchParams
}: CarCardProps) {
  const router = useRouter()

  const handleBooking = () => {
    const params = new URLSearchParams({
      offerId: offer.id,
      pickupDateTime: searchParams?.pickupDateTime || '',
      dropoffDateTime: searchParams?.dropoffDateTime || '',
      pickupLocation: searchParams?.pickupLocation || '',
      dropoffLocation: searchParams?.dropoffLocation || searchParams?.pickupLocation || '',
    })

    router.push(`/car/booking?${params.toString()}`)
  }

  const getTransmissionColor = (transmission: string) => {
    return transmission === 'automatic' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
  }

  return (
    <Card className="w-full max-w-6xl overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-4 h-full w-full justify-center items-center">
          <div className="w-full md:w-[400px] md:h-[250px] h-[250px]">
            <Carousel className="w-full h-full flex justify-center items-center overflow-hidden">
              <CarouselContent>
                {offer.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="h-full w-full">
                      <img
                        src={image.url}
                        alt={image.alt || `${offer.name} - Image ${index + 1}`}
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

          <div className="flex flex-col p-4 flex-1">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{offer.name}</h3>
                  {offer.vendor.logo && (
                    <img 
                      src={offer.vendor.logo} 
                      alt={offer.vendor.name}
                      className="h-8 object-contain" 
                    />
                  )}
                </div>
                <p className="text-muted-foreground text-sm">{offer.model} or similar</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{offer.features.seats} seats</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span>{offer.features.doors} doors</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                  <span>{offer.features.fuelType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {offer.mileage?.unlimited 
                      ? 'Unlimited mileage' 
                      : `${offer.mileage?.limit} ${offer.mileage?.unit}`}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="secondary" 
                  className={getTransmissionColor(offer.features.transmission)}
                >
                  {offer.features.transmission}
                </Badge>
                {offer.features.airConditioning && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    Air conditioning
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {offer.features.category}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {offer.cancellationPolicy?.isCancellable && (
                    <div className="flex items-center gap-2 text-green-600">
                      <Shield className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Free cancellation</p>
                        {offer.cancellationPolicy.deadline && (
                          <p className="text-xs">until {offer.cancellationPolicy.deadline}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {offer.price.includesInsurance && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <CreditCard className="h-4 w-4" />
                      <p className="text-sm">Insurance included</p>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="space-y-1">
                    <span className="text-2xl font-bold">
                      ${offer.price.amount}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {offer.price.includesTaxes ? 'includes taxes & fees' : 'plus taxes & fees'}
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button onClick={handleBooking}>Book Now</Button>
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