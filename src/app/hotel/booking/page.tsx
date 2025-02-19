import HotelBookingPage from '@/components/pages/HotelBookingPage'
import Header from '@/components/Header'

export default async function BookingPage({ 
  searchParams 
}: { 
  searchParams: any
}) {
  const { propertyToken, q, checkIn, checkOut, adults } = await searchParams
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Header title="Hotel Booking" />
      <HotelBookingPage 
        propertyToken={propertyToken}
        query={q}
        checkIn={checkIn}
        checkOut={checkOut}
        adults={parseInt(adults)}
      />
    </div>
  )
}