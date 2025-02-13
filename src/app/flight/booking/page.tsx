import Header from '@/components/Header'
import FlightBookingPage from '@/components/pages/FlightBookingPage'
import { FlightOffer } from '@/types'

export interface SingleFlightSearchParams {
  flightData: string
}

export default async function BookingPage({ searchParams }: { searchParams: SingleFlightSearchParams }) {
  const flightData: FlightOffer = JSON.parse(decodeURIComponent(searchParams.flightData))
  
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Header title="Flight Booking" />
      <FlightBookingPage flightData={flightData} />
    </div>
  )
}