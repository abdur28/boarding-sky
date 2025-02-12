import CarBookingPage from '@/components/pages/CarBookingPage'
import Header from '@/components/Header'

export default function BookingPage({ 
  params,
  searchParams 
}: { 
  params: { id: string }
  searchParams: { 
    pickupDate: string
    returnDate: string
    location: string
  }
}) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Header title="Car Rental Booking" />
      <CarBookingPage />
    </div>
  )
}