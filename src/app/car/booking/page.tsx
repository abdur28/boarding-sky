import Header from '@/components/Header'
import CarBookingPage from '@/components/pages/CarBookingPage'

export default async function BookingPage({ 
  searchParams 
}: { 
  searchParams: any
}) {
  const { offerId, pickupDate, dropoffDate, pickupLocation, dropoffLocation, pickupTime, dropoffTime, providerId } = await searchParams
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Header title="Car Rental Booking" />
      <CarBookingPage 
        offerId={offerId}
        pickupDate={pickupDate}
        dropoffDate={dropoffDate}
        pickupLocation={pickupLocation}
        dropoffLocation={dropoffLocation}
        pickupTime={pickupTime}
        dropoffTime={dropoffTime}
        provider={providerId}
      />
    </div>
  )
}