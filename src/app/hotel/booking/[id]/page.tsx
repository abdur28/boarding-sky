import HotelBookingPage from '@/components/pages/HotelBookingPage'
import Header from '@/components/Header'

export default function BookingPage({ 
  params,
  searchParams 
}: { 
  params: { id: string }
  searchParams: { 
    checkIn: string
    checkOut: string
    guests: string
    rooms: string
  }
}) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Header title="Hotel Booking" />
      <HotelBookingPage />
    </div>
  )
}