import CarSearchPage from '@/components/pages/CarSearchPage'
import Header from '@/components/Header'

export default async function SearchPage({ 
  searchParams 
}: ({ searchParams: any })) {
  const params = await searchParams
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Header title="Car Rental Search" />
      <CarSearchPage {...params} />
    </div>
  )
}