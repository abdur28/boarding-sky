import HotelBookingPage from '@/components/pages/HotelBookingPage'
import Header from '@/components/Header'

export default function BookingPage({ 
  searchParams 
}: { 
  searchParams: { 
    hotelId: string
    q: string
    checkIn: string
    checkOut: string
    adults: string
    propertyToken: string
  }
}) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Header title="Hotel Booking" />
      <HotelBookingPage 
        propertyToken={searchParams.propertyToken}
        query={searchParams.q}
        checkIn={searchParams.checkIn}
        checkOut={searchParams.checkOut}
        adults={parseInt(searchParams.adults)}
      />
    </div>
  )
}