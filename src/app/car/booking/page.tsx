import Header from '@/components/Header'
import CarBookingPage from '@/components/pages/CarBookingPage'

export default function BookingPage({ 
  searchParams 
}: { 
  searchParams: { 
    offerId: string
    pickupDate: string
    dropoffDate: string
    pickupLocation: string
    dropoffLocation: string
  }
}) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Header title="Car Rental Booking" />
      <CarBookingPage 
        offerId={searchParams.offerId}
        pickupDate={searchParams.pickupDate}
        dropoffDate={searchParams.dropoffDate}
        pickupLocation={searchParams.pickupLocation}
        dropoffLocation={searchParams.dropoffLocation}
      />
    </div>
  )
}