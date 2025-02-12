import CarSearchPage from '@/components/pages/CarSearchPage'
import Header from '@/components/Header'

export default function SearchPage({ 
  searchParams 
}: { 
  searchParams: { 
    location: string
    pickupDate: string
    returnDate: string
    [key: string]: string 
  }
}) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Header title="Car Rental Search" />
      <CarSearchPage />
    </div>
  )
}