import Header from '@/components/Header'
import RoomSelectionPage from '@/components/pages/RoomSelectionPage'

export default function HotelPage({ 
  params,
  searchParams 
}: { 
  params: { id: string }
  searchParams: { 
    checkIn: string
    checkOut: string
    guests: string
    rooms: string
  }
}) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Header title="Select Your Room" />
      <RoomSelectionPage
        checkIn={searchParams.checkIn}
        checkOut={searchParams.checkOut}
        guests={parseInt(searchParams.guests)}
        rooms={parseInt(searchParams.rooms)}
      />
    </div>
  )
}