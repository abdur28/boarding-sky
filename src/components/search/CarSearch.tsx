import { CalendarIcon, Clock, Search } from 'lucide-react'
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CitySearchPopup } from './CitySearchPopup'
import { format } from "date-fns"

const TimeSelect = ({ value, onChange }: { 
  value: string, 
  onChange: (time: string) => void 
}) => {
  // Generate time options in 30-minute intervals
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2).toString().padStart(2, '0')
    const minute = (i % 2 === 0 ? '00' : '30')
    return `${hour}:${minute}`
  })

  return (
    <div className="grid grid-cols-4 gap-2 p-4 h-[300px] overflow-y-auto">
      {timeOptions.map((time) => (
        <Button
          key={time}
          variant={value === time ? "default" : "ghost"}
          className="text-sm"
          onClick={() => onChange(time)}
        >
          {time}
        </Button>
      ))}
    </div>
  )
}

const CarSearch = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [dates, setDates] = useState<{
        from: Date | undefined
        to: Date | undefined
    }>({
        from: searchParams.get('pickUpDate') ? new Date(searchParams.get('pickUpDate')!) : undefined,
        to: searchParams.get('dropOffDate') ? new Date(searchParams.get('dropOffDate')!) : undefined,
    })

    const [pickUpTime, setPickUpTime] = useState(searchParams.get('pickUpTime') || '10:00')
    const [dropOffTime, setDropOffTime] = useState(searchParams.get('dropOffTime') || '10:00')
    const [pickUpLocation, setPickUpLocation] = useState(searchParams.get('pickUpLocation') || '')
    const [dropOffLocation, setDropOffLocation] = useState(searchParams.get('dropOffLocation') || '')
    const [market, setMarket] = useState(searchParams.get('market') || 'us')

    const handleSearch = () => {
        if (!dates.from || !dates.to || !pickUpLocation) {
            return
        }

        const pickUpDate = format(dates.from, 'yyyy-MM-dd')
        const dropOffDate = format(dates.to, 'yyyy-MM-dd')
        
        const formatedPickUpLocation = pickUpLocation.split(' - ')[0]
        const formatedDropOffLocation = dropOffLocation ? dropOffLocation.split(' - ')[0] : formatedPickUpLocation

        const params = new URLSearchParams({
            pickUpDate,
            dropOffDate,
            pickUpTime,
            dropOffTime,
            market,
            pickUpLocation: formatedPickUpLocation,
            ...(dropOffLocation && { dropOffLocation: formatedDropOffLocation }),
            page: '1'
        })
        router.push(`/car/search?${params.toString()}`)
    }

    const formatDateRange = () => {
        if (!dates.from) return "Select dates"
        if (!dates.to) return format(dates.from, 'MMM dd, yyyy')
        return `${format(dates.from, 'MMM dd, yyyy')} - ${format(dates.to, 'MMM dd, yyyy')}`
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                    <CitySearchPopup
                        label="Pickup location"
                        placeholder="Enter city or airport"
                        type="car"
                        onCitySelect={(value) => {
                            setPickUpLocation(value)
                            setMarket(value.split(' - ')[2].toUpperCase())
                        }}
                        onChange={(value) => setPickUpLocation(value)}
                    />
                </div>

                <div className="space-y-2">
                    <CitySearchPopup
                        label="Drop-off location"
                        placeholder="Same as pickup"
                        type="car"
                        onCitySelect={(value) => setDropOffLocation(value)}
                        onChange={(value) => setDropOffLocation(value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Pickup/Return dates</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formatDateRange()}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dates.from}
                                selected={{
                                    from: dates.from,
                                    to: dates.to
                                }}
                                onSelect={(range: any) => setDates(range)}
                                numberOfMonths={2}
                                disabled={(date) => date < new Date()}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-2">
                    <Label>Pickup time</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                            >
                                <Clock className="mr-2 h-4 w-4" />
                                {pickUpTime}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <TimeSelect
                                value={pickUpTime}
                                onChange={setPickUpTime}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-2">
                    <Label>Drop-off time</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                            >
                                <Clock className="mr-2 h-4 w-4" />
                                {dropOffTime}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <TimeSelect
                                value={dropOffTime}
                                onChange={setDropOffTime}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="flex justify-end">
                <Button 
                    className="gap-2"
                    onClick={handleSearch}
                    disabled={!dates.from || !dates.to || !pickUpLocation}
                >
                    <Search className="w-4 h-4" />
                    Search Cars
                </Button>
            </div>
        </div>
    )
}

export default CarSearch