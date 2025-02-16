import Header from '@/components/Header'
import PaymentPage from '@/components/pages/PaymentPage'

export default async function BookingPage({ 
  searchParams 
}: { 
  searchParams: { 
    type: 'flight' | 'hotel' | 'car'
    price: string
    currency: string
    offerId: string
    pickupDate: string
    dropoffDate: string
    pickupLocation: string
    dropoffLocation: string
  }
}) {
  const params = await searchParams
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Header title="Car Rental Payment" />
      <PaymentPage searchParams={params} />
    </div>
  )
}