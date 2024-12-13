'use client'

import { CalendarIcon, Search, Users, TicketIcon, PlusCircle, MinusCircle } from 'lucide-react'
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CitySearchPopup } from './CitySearchPopup'
import { useRouter } from 'next/navigation'
import { useAmadeus } from '@/hooks/useAmadeus'


export default function Component() {
  const router = useRouter()
  const [dates, setDates] = useState<any>({
    from: undefined,
    to: undefined,
  })
  const [destination, setDestination] = useState<string>('')
  const [guests , setGuests] = useState({
    adults: 2,
    children: 0,
    rooms: 1
  })

  const { hotelOfferSearch, hotelRatingSearch } = useAmadeus()

  // Submit Search

  const handleHotelSearch = async() => {
    if (!destination || !dates.from || !dates.to) return
    const city = destination.split(' - ')[1]
    const checkIn = dates.from.toISOString().split('T')[0]
    const checkOut = dates.to.toISOString().split('T')[0]
    const adults = guests.adults
    const rooms = guests.rooms
    console.log(city, checkIn, checkOut, adults, rooms)
    // await hotelOfferSearch(city, checkIn, checkOut, adults, rooms)
    // hotelRatingSearch(2);
    router.push(`/hotel/search?city=${city}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&rooms=${rooms}&page=1`)
  }

  return (
        
              <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <CitySearchPopup
                      label="Destination"
                      placeholder="Where are you going?"
                      type="city"
                      onCitySelect={(value) => setDestination(value)}
                      onChange={(value) => setDestination(value)}
                    />
                    <div className="">
                      <Label>Check-in/out</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {
                              dates.from && dates.to ? (
                                `${dates.from.toLocaleDateString()} - ${dates.to.toLocaleDateString()}`
                              ) : (
                                <span>Pick dates</span>
                              )
                            }
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            selected={dates}
                            onSelect={setDates}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="">
                      <Label>Guests/Rooms</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            <div className="flex flex-row gap-2 items-start">
                              
                                <span className="text-muted-foreground">{guests.adults ? `${guests.adults} Adult${guests.adults > 1 ? 's' : ''}` : ''}</span>
                                <span className="text-muted-foreground">{guests.children ? `${guests.children} Child${guests.children > 1 ? 'ren' : ''}` : ''}</span>
                                <span className="text-muted-foreground">|</span>
                                <span className="text-muted-foreground">{guests.rooms ? `${guests.rooms} Room${guests.rooms > 1 ? 's' : ''}` : ''}</span>
                                
                  
                            </div>
                            <Users className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">Travelers and Rooms</h4>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Adult</span>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="icon"
                                  onClick={() => {guests.adults > 1 && setGuests({...guests, adults: guests.adults - 1})}} 
                                  className="h-8 w-8">-</Button>
                                  <span className="w-8 text-center">{guests.adults}</span>
                                  <Button variant="outline" size="icon" 
                                  onClick={() => setGuests({...guests, adults: guests.adults + 1})}
                                  className="h-8 w-8">+</Button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Child</span>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="icon" 
                                  onClick={() => {guests.children > 0 && setGuests({...guests, children: guests.children - 1})}}
                                  className="h-8 w-8">-</Button>
                                  <span className="w-8 text-center">{guests.children}</span>
                                  <Button variant="outline" size="icon" 
                                  onClick={() => setGuests({...guests, children: guests.children + 1})}
                                  className="h-8 w-8">+</Button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Room</span>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="icon" 
                                  onClick={() => {guests.rooms > 1 && setGuests({...guests, rooms: guests.rooms - 1})}}
                                  className="h-8 w-8">-</Button>
                                  <span className="w-8 text-center">{guests.rooms}</span>
                                  <Button variant="outline" size="icon" 
                                  onClick={() => setGuests({...guests, rooms: guests.rooms + 1})} 
                                  className="h-8 w-8">+</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                <div className="flex justify-end items-center">
                  <Button onClick={handleHotelSearch} className="gap-2">
                    <Search className="w-4 h-4" />
                    Search Hotels
                  </Button>
                </div>
              </div>
  )
}