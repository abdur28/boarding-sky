'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, Star, Info, Shield, Calendar, Users, Coffee, Clock, CreditCard, Check } from "lucide-react"
import { HotelOffer, HotelOfferDetails } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useRouter } from "next/navigation"
import { HotelBookingForm } from "@/components/forms/HotelBookingForm"

interface HotelBookingPageProps {
    propertyToken: string
    query: string
    checkIn: string
    checkOut: string
    adults: number
}

interface BookingResponse {
    offer: HotelOffer
    details: HotelOfferDetails
}

const HotelBookingPage = ({
    propertyToken,
    query,
    checkIn,
    checkOut,
    adults,
}: HotelBookingPageProps) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [bookingData, setBookingData] = useState<BookingResponse | null>(null)
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
    const [isFormValid, setIsFormValid] = useState(false)
    const [formData, setFormData] = useState<any>(null)

    useEffect(() => {
        const fetchHotelOffer = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const response = await fetch('/api/serp/hotel-offer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        propertyId: propertyToken,
                        q: query,
                        checkIn,
                        checkOut,
                        adults,
                    }),
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch hotel offer')
                }

                const data = await response.json()
                if (!data.success) {
                    throw new Error(data.error || 'Failed to fetch hotel offer')
                }

                setBookingData(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setIsLoading(false)
            }
        }

        if (propertyToken) {
            fetchHotelOffer()
        }
    }, [propertyToken, query, checkIn, checkOut, adults])

    const handleRoomSelect = (roomId: string) => {
        setSelectedRoom(roomId)
    }

    const handleFormChange = (isValid: boolean, data: any) => {
        setIsFormValid(isValid)
        setFormData(data)
    }
    const handleBookNow = async () => {
        if (!selectedRoom || !bookingData || !isFormValid || !formData) return
        setIsLoading(true)
    
        try {
            const selectedRoomData = bookingData.details.rooms.find(room => room.id === selectedRoom)
            if (!selectedRoomData) throw new Error('Selected room not found')
    
            const response = await fetch('/api/payment/checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingType: 'hotel',
                    offer: bookingData.offer,
                    price: selectedRoomData.price.amount,
                    bookingDetails: {
                        email: formData.email,
                        phone: formData.phone,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        checkIn,
                        checkOut,
                        rooms: 1,
                        guests: formData.guests,
                        specialRequests: formData.specialRequests,
                        roomDetails: {
                            id: selectedRoomData.id,
                            name: selectedRoomData.name,
                            price: selectedRoomData.price,
                            maxOccupancy: selectedRoomData.maxOccupancy
                        }
                    },
                    provider: bookingData.offer.provider
                }),
            })
    
            const data = await response.json()
    
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session')
            }
    
            if (data.url) {
                window.location.href = data.url
            } else {
                throw new Error('Invalid checkout session response')
            }
        } catch (error) {
            console.error('Error:', error)
            setError(error instanceof Error ? error.message : 'Failed to process payment')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) return <LoadingState />
    if (error) return <ErrorState message={error} />
    if (!bookingData) return <NoDataState />

    const { offer, details } = bookingData

    return (
        <div className="w-full max-w-7xl px-5 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Hotel Images */}
                    <Card>
                        <CardContent className="p-6">
                            <Carousel className="w-full h-[400px]">
                                <CarouselContent>
                                    {offer.images.map((image, index) => (
                                        <CarouselItem key={index}>
                                            <img
                                                src={image.original || image.thumbnail}
                                                alt={image.alt || `${offer.name} - Image ${index + 1}`}
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

                    {/* Hotel Information */}
                    <Card>
                        <CardHeader>
                            <div className="space-y-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-2xl">{offer.name}</CardTitle>
                                        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            <span>{offer.location.address}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.floor(offer.hotelClass || 0) }).map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant="secondary" className="bg-green-50 text-green-700">
                                        {offer.rating.overall.toFixed(1)} / 10
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        {offer.rating.totalReviews} reviews
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Check-in</p>
                                        <p className="text-sm text-muted-foreground">{checkIn}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Check-out</p>
                                        <p className="text-sm text-muted-foreground">{checkOut}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Guests</p>
                                        <p className="text-sm text-muted-foreground">{adults} adults</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Coffee className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Room Type</p>
                                        <p className="text-sm text-muted-foreground">{details.type}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Description</h3>
                                <p className="text-muted-foreground">{offer.description}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Room Options */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Available Rooms</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {details.rooms.map((room) => (
                                <Card key={room.id} className={`border-2 transition-colors ${
                                    selectedRoom === room.id ? 'border-primary' : 'border-transparent'
                                }`}>
                                    <CardContent className="p-4">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="w-full md:w-1/3">
                                                {room.images[0] && (
                                                    <img
                                                        src={room.images[0].url}
                                                        alt={room.images[0].alt || room.name}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium">{room.name}</h4>
                                                        <div className="space-y-2 mt-2">
                                                            <p className="text-sm text-muted-foreground">
                                                                Max occupancy: {room.maxOccupancy} guests
                                                            </p>
                                                            {room.cancellationPolicy?.isCancellable && (
                                                                <div className="flex items-center gap-2 text-green-600">
                                                                    <Shield className="h-4 w-4" />
                                                                    <p className="text-sm">
                                                                        Free cancellation until {room.cancellationPolicy.deadline}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-semibold">
                                                            ${room.price.amount}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            per night
                                                        </p>
                                                        <Button
                                                            size="sm"
                                                            variant={selectedRoom === room.id ? "default" : "outline"}
                                                            className="mt-2"
                                                            onClick={() => handleRoomSelect(room.id)}
                                                        >
                                                            {selectedRoom === room.id ? 'Selected' : 'Select'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Booking Form - Only show when a room is selected */}
                    {selectedRoom && (
                        <HotelBookingForm 
                            onFormChange={handleFormChange}
                            numberOfRooms={1}
                            numberOfGuests={adults}
                        />
                    )}

                    {/* Amenities */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Amenities & Services</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {offer.amenities.map((amenity) => (
                                    <div key={amenity} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-600" />
                                        <span className="text-sm">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Nearby Places */}
                    {offer.nearbyPlaces && offer.nearbyPlaces.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Nearby Places</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {offer.nearbyPlaces.map((place, index) => (
                                        <div key={index} className="space-y-1">
                                            <p className="font-medium">{place.name}</p>
                                            <p className="text-sm text-muted-foreground">{place.category}</p>
                                            {place.rating && (
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-sm">{place.rating}</span>
                                                    {place.reviews && (
                                                        <span className="text-sm text-muted-foreground">
                                                            ({place.reviews} reviews)
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
                                {/* Price Summary */}
                                <div className="lg:col-span-1">
                    <Card className="sticky top-20">
                        <CardHeader>
                            <CardTitle>Price Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {selectedRoom ? (
                                <>
                                    {/* Selected Room Details */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span>Room Rate (per night)</span>
                                            <span>${offer.price.beforeTaxes}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Number of Nights</span>
                                            <span>
                                                {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Taxes & fees</span>
                                            <span>
                                                ${offer.price.current - (offer.price.beforeTaxes || 0)}
                                            </span>
                                        </div>
                                        {offer.price.discount && (
                                            <div className="flex justify-between text-green-600">
                                                <span>{offer.price.discount.label}</span>
                                                <span>-${offer.price.discount.amount}</span>
                                            </div>
                                        )}
                                        <div className="pt-4 border-t">
                                            <div className="flex justify-between font-semibold">
                                                <span>Total Price</span>
                                                <div className="text-right">
                                                    <span className="text-2xl">${offer.price.current}</span>
                                                    <p className="text-xs text-muted-foreground">
                                                        {offer.price.includesTaxes ? 'Includes' : 'Excludes'} taxes and fees
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Information */}
                                        <div className="space-y-3 pt-4">
                                            {offer.refundable && (
                                                <div className="flex items-center gap-2 text-green-600">
                                                    <Shield className="h-4 w-4" />
                                                    <span className="text-sm">Free cancellation available</span>
                                                </div>
                                            )}
                                            {details.bookingOptions?.guarantee?.required && (
                                                <div className="flex items-center gap-2">
                                                    <Info className="h-4 w-4" />
                                                    <span className="text-sm">
                                                        Deposit required: ${details.bookingOptions.guarantee.amount}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <Button 
                                            className="w-full mt-4" 
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
                                    </div>
                                </>
                            ) : (
                                <div className="text-center space-y-4">
                                    <Info className="h-8 w-8 mx-auto text-muted-foreground" />
                                    <p className="text-muted-foreground">
                                        Please select a room to see the final price
                                    </p>
                                </div>
                            )}

                            {/* Hotel Policies */}
                            <div className="space-y-3 pt-4 border-t">
                                <h3 className="font-medium">Hotel Policies</h3>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <div>
                                            <p>Check-in time: {offer.checkIn}</p>
                                            <p>Check-out time: {offer.checkOut}</p>
                                        </div>
                                    </div>
                                    {details.bookingOptions?.paymentTypes && details.bookingOptions?.paymentTypes?.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" />
                                            <p>Accepted payment methods: {details.bookingOptions.paymentTypes.join(', ')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
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
        <p className="text-lg text-muted-foreground">Loading hotel details...</p>
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
        <p className="text-xl font-semibold text-muted-foreground">No hotel data found</p>
        <p className="text-muted-foreground">Please try again with different search criteria</p>
    </div>
)

export default HotelBookingPage