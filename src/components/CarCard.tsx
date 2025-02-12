import { useRouter } from "next/navigation"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Clock, Gauge, Radio, Users, Wind } from "lucide-react"
import { Button } from "./ui/button"

export function CarCard({
    id,
    name = "Chevrolet Malibu",
    type = "Fullsize",
    price = 39.45,
    features = {
      passengers: 5,
      bags: 2,
      doors: 4,
      transmission: "Automatic",
      ac: true,
      mileage: "Unlimited"
    },
    location = "1 Northside Piers, Brooklyn",
    available = true,
    refundable = true
  }) {
    const router = useRouter()
  
    return (
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-12 gap-6">
            {/* Car Image & Details */}
            <div className="md:col-span-3">
              <div className="aspect-square bg-gray-100 rounded-lg mb-4">
                <img 
                  src="/placeholder-image.png" 
                  alt={name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              {available && refundable && (
                <Badge variant="outline" className="w-full justify-center">
                  Free cancellation
                </Badge>
              )}
            </div>
  
            {/* Car Info */}
            <div className="md:col-span-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="text-muted-foreground">{type} or similar</p>
              </div>
  
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{features.passengers} Passengers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4" />
                  <span>{features.transmission}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4" />
                  <span>Air Conditioning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  <span>{features.mileage} mileage</span>
                </div>
              </div>
  
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Available at {location}</span>
              </div>
            </div>
  
            {/* Price & Book */}
            <div className="md:col-span-3 flex flex-col justify-between">
              <div className="text-right">
                <p className="text-2xl font-bold">${price}</p>
                <p className="text-sm text-muted-foreground">per day</p>
              </div>
              <Button 
                className="w-full mt-4" 
                onClick={() => router.push(`/car/booking/${id}`)}
                disabled={!available}
              >
                {available ? 'Select' : 'Not Available'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }