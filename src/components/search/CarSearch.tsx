'use client'

import { CalendarIcon, Search } from 'lucide-react'
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CitySearchPopup } from './CitySearchPopup'

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

    const [pickUpLocation, setPickUpLocation] = useState(searchParams.get('pickUpLocation') || '')
    const [dropOffLocation, setDropOffLocation] = useState(searchParams.get('dropOffLocation') || '')

    const handleSearch = () => {
        if (!dates.from || !dates.to || !pickUpLocation) {
            return
        }

        const pickUpDate = dates.from.toISOString().split('T')[0]
        const dropOffDate = dates.to.toISOString().split('T')[0]

        const params = new URLSearchParams({
            pickUpDate,
            dropOffDate,
            pickUpLocation,
            ...(dropOffLocation && { dropOffLocation }),
            page: '1'
        })

        router.push(`/car/search?${params.toString()}`)
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                    <CitySearchPopup
                        label="Pickup location"
                        placeholder="Enter city or airport"
                        type="city"
                        onCitySelect={(value) => setPickUpLocation(value)}
                        onChange={(value) => setPickUpLocation(value)}
                    />
                </div>

                <div className="space-y-2">
                    <CitySearchPopup
                        label="Drop-off location"
                        placeholder="Same as pickup"
                        type="city"
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
                                {dates.from ? (
                                    dates.to ? (
                                        <>
                                            {dates.from.toLocaleDateString()} -{" "}
                                            {dates.to.toLocaleDateString()}
                                        </>
                                    ) : (
                                        dates.from.toLocaleDateString()
                                    )
                                ) : (
                                    <span>Select dates</span>
                                )}
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