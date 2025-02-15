import CarSearchPage from '@/components/pages/CarSearchPage'
import Header from '@/components/Header'

export default function SearchPage({ 
  searchParams 
}: { 
  searchParams: { 
    pickUpLocation: string
    dropOffLocation?: string
    pickUpDate: string
    dropOffDate: string
    page: number
    priceRange?: {
      min?: number
      max?: number
    }
  }
}) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Header title="Car Rental Search" />
      <CarSearchPage {...searchParams} />
    </div>
  )
}