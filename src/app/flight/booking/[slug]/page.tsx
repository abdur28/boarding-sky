import Header from '@/components/Header'
import FlightBookingPage from '@/components/pages/FlightBookingPage'

export default function BookingPage({ params }: { params: { slug: string } }) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Header title="Flight Booking" />
      <FlightBookingPage />
    </div>
  )
}