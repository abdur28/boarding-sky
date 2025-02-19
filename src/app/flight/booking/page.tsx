// app/flight/booking/page.tsx
import Header from '@/components/Header'
import FlightBookingPage from '@/components/pages/FlightBookingPage'
import { FlightOffer } from '@/types'
import { off } from 'process'

interface BookingSearchParams {
  offerId: string
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  adults: string
  children?: string
  infants?: string
  travelClass: string
  providerId: string
}

async function getAmadeusToken() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/amadeus/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch authentication token')
  }

  const data = await response.json()
  return data.data.access_token
}

async function getFlightOffer(params: BookingSearchParams) {
  // Get Amadeus token if needed
  let token = ''
  if (params.providerId === 'amadeus') {
    token = await getAmadeusToken()
  }

  if (params.providerId === 'direct') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/actions/get-flight-offer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: params.offerId}),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch flight offer')
    }

    const data = await response.json()
    return data.data
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${params.providerId}/flight-offer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      offerId: params.offerId,
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      adults: parseInt(params.adults),
      children: params.children ? parseInt(params.children) : 0,
      infants: params.infants ? parseInt(params.infants) : 0,
      travelClass: params.travelClass
    }),
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch flight offer')
  }

  const data = await response.json()
  return data.data
}

export default async function BookingPage({ 
  searchParams 
}: { 
  searchParams: BookingSearchParams 
}) {
  const params = await searchParams
  
  // Fetch flight offer data
  const flightData = await getFlightOffer(params)
  
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Header title="Flight Booking" />
      <FlightBookingPage 
        flightData={flightData}
        passengerCounts={{
          adults: parseInt(params.adults),
          children: params.children ? parseInt(params.children) : 0,
          infants: params.infants ? parseInt(params.infants) : 0
        }}
      />
    </div>
  )
}