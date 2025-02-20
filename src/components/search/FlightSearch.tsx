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
import { useAmadeus } from '@/hooks/useAmadeus'
import { useRouter } from 'next/navigation'

type TripType = 'roundtrip' | 'oneway' | 'multicity'

interface City {
  from: string
  to: string
  date: Date | undefined
}

export default function Component({isSearch = false}:{isSearch: boolean}) {
  const router = useRouter()
  const [tripType, setTripType] = useState<TripType>('roundtrip')
  const [dates, setDates] = useState<any>({
    from: undefined,
    to: undefined,
  })
  const [cities, setCities] = useState<City[]>([
    { from: '', to: '', date: undefined },
    { from: '', to: '', date: undefined },
  ])
  const [passengers , setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0
  })

  const [cabinClass, setCabinClass] = useState('economy')

  const handleTripTypeChange = (value: TripType) => {
    setTripType(value)
    if (value === 'oneway' || value === 'multicity') {
      setDates({ from: undefined, to: undefined })
    }
    if (value === 'multicity') {
      setCities([
        { from: '', to: '', date: undefined },
        { from: '', to: '', date: undefined }     
      ])
    } else {
      setCities([{ from: '', to: '', date: undefined }])
    }
  }

  const handleCityChange = (index: number, field: 'from' | 'to', value: string) => {
    const newCities = [...cities]
    newCities[index][field] = value
    setCities(newCities)
  }

  const handleDateChange = (index: number, date: Date | undefined) => {
    const newCities = [...cities]
    newCities[index].date = date
    setCities(newCities)
  }

  const addCity = () => {
    setCities([...cities, { from: '', to: '', date: undefined }])
  }

  const removeCity = (index: number) => {
    const newCities = cities.filter((_, i) => i !== index)
    setCities(newCities)
  }

  // Submit Search

  const handleFlightSearch = () => {
    const { from, to, date } = cities[0]
    const origin = from.split(' - ')[0].split('(')[1]
    const destination = to.split(' - ')[0].split('(')[1]
    const departureDate = tripType === 'oneway' || tripType === 'multicity' ? date && date.toISOString().split('T')[0] : dates.from.toISOString().split('T')[0]
    const returnDate = dates.to ? dates.to.toISOString().split('T')[0] : ''
    const travelClass = cabinClass.toUpperCase()
    const adults = passengers.adults
    const children = passengers.children
    const infants = passengers.infants
    router.push(`/flight/search?origin=${origin}&destination=${destination}&travelClass=${travelClass}&departureDate=${departureDate}${returnDate  ? `&returnDate=${returnDate}`: ``}&adults=${adults}${children > 0 ? `&children=${children}`: ``}${infants > 0 ? `&infants=${infants}`: ``}`)
  }

  return (
          <Tabs defaultValue="flights" className="w-full">
            {/* {!isSearch && (
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="flights">Flight</TabsTrigger>
              <TabsTrigger value="manage-booking">Manage Booking</TabsTrigger>
              <TabsTrigger value="flight-status">Flight Status</TabsTrigger>
            </TabsList>
            )} */}
            <TabsContent value="flights">
              <div className="space-y-6">
                <RadioGroup value={tripType} onValueChange={handleTripTypeChange} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="oneway" id="oneway" />
                    <Label htmlFor="oneway">One way</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="roundtrip" id="roundtrip" />
                    <Label htmlFor="roundtrip">Round-trip</Label>
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <RadioGroupItem value="multicity" id="multicity" />
                    <Label htmlFor="multicity">Multi-city</Label>
                  </div> */}
                </RadioGroup>
                {tripType === 'multicity' ? (
                  <div className="">
                    {cities.map((city, index) => (
                      <div key={index} className="grid gap-6 md:grid-cols-3">
                        <CitySearchPopup
                          label="From"
                          placeholder="Departure city"
                          type="airport"
                          onCitySelect={(value) => handleCityChange(index, 'from', value)}
                          onChange={(value) => {handleCityChange(index, 'from', value)}}
                        />
                        <CitySearchPopup
                          label="To"
                          placeholder="Arrival city"
                          onCitySelect={(value) => handleCityChange(index, 'to', value)}
                          onChange={(value) => handleCityChange(index, 'to', value)}
                        />
                        <div className="">
                          <Label>Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {city.date ? (
                                  city.date.toLocaleDateString()
                                ) : (
                                  <span>Pick date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                initialFocus
                                mode="single"
                                selected={city.date}
                                onSelect={(date) => handleDateChange(index, date)}
                                numberOfMonths={1}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        {index >= 2 && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="-mt-3"
                            onClick={() => removeCity(index)}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {cities.length < 5 && (
                      <Button variant="outline" onClick={addCity} className="mt-4">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add City
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-3">
                    <CitySearchPopup
                      label="From"
                      placeholder="Departure city"
                      onCitySelect={(value) => handleCityChange(0, 'from', value)}
                      onChange={(value) => handleCityChange(0, 'from', value)}
                    />
                    <CitySearchPopup
                      label="To"
                      placeholder="Arrival city"
                      onCitySelect={(value) => handleCityChange(0, 'to', value)}
                      onChange={(value) => handleCityChange(0, 'to', value)}
                    />
                    <div className="">
                      <Label>Date{tripType === 'roundtrip' ? 's' : ''}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {tripType === 'roundtrip' ? (
                              dates.from && dates.to ? (
                                `${dates.from.toLocaleDateString()} - ${dates.to.toLocaleDateString()}`
                              ) : (
                                <span>Pick dates</span>
                              )
                            ) : (
                              cities[0].date ? (
                                cities[0].date.toLocaleDateString()
                              ) : (
                                <span>Pick date</span>
                              )
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode={tripType === 'roundtrip' ? 'range' : 'single'}
                            selected={tripType === 'roundtrip' ? dates : cities[0].date}
                            onSelect={tripType === 'roundtrip' ? setDates : (date: any) => handleDateChange(0, date)}
                            numberOfMonths={tripType === 'roundtrip' ? 2 : 1}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}
                <div className='grid gap-6 md:grid-cols-3'>
                  <div className="space-y-2">
                    <Label>Passengers</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          <div className="flex flex-row gap-2 items-start">
                            
                              <span className="text-muted-foreground">{passengers.adults ? `${passengers.adults} Adult${passengers.adults > 1 ? 's' : ''}` : ''}</span>
                              <span className="text-muted-foreground">{passengers.children ? `${passengers.children} Child${passengers.children > 1 ? 'ren' : ''}` : ''}</span>
                              <span className="text-muted-foreground">{passengers.infants ? `${passengers.infants} Infant${passengers.infants > 1 ? 's' : ''}` : ''}</span>
                 
                          </div>
                          <Users className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">Passengers</h4>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Adult</span>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon"
                                 onClick={() => {passengers.adults > 1 && setPassengers({...passengers, adults: passengers.adults - 1})}} 
                                 className="h-8 w-8">-</Button>
                                <span className="w-8 text-center">{passengers.adults}</span>
                                <Button variant="outline" size="icon" 
                                onClick={() => setPassengers({...passengers, adults: passengers.adults + 1})}
                                className="h-8 w-8">+</Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Child</span>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" 
                                onClick={() => {passengers.children > 0 && setPassengers({...passengers, children: passengers.children - 1})}}
                                className="h-8 w-8">-</Button>
                                <span className="w-8 text-center">{passengers.children}</span>
                                <Button variant="outline" size="icon" 
                                onClick={() => setPassengers({...passengers, children: passengers.children + 1})}
                                className="h-8 w-8">+</Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Infant</span>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" 
                                onClick={() => {passengers.infants > 0 && setPassengers({...passengers, infants: passengers.infants - 1})}}
                                className="h-8 w-8">-</Button>
                                <span className="w-8 text-center">{passengers.infants}</span>
                                <Button variant="outline" size="icon" 
                                onClick={() => setPassengers({...passengers, infants: passengers.infants + 1})} 
                                className="h-8 w-8">+</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Class</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          <div className="flex flex-col items-start">
                            <span className="text-muted-foreground">{cabinClass === 'economy' ? 'Economy' : cabinClass === 'business' ? 'Business' : 'First Class'}</span>
                          </div>
                          <TicketIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">Class</h4>
                            <RadioGroup defaultValue={cabinClass} onValueChange={setCabinClass} >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="economy" id="economy" />
                                <Label htmlFor="economy">Economy</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="business" id="business" />
                                <Label htmlFor="business">Business</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="first" id="first" />
                                <Label htmlFor="first">First Class</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex justify-end items-center">
                  <Button onClick={handleFlightSearch} className="gap-2">
                    <Search className="w-4 h-4" />
                    Search Flights
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="manage-booking">
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 ">
                  <div className="space-y-2">
                    <Label htmlFor="bookingId">Booking ID</Label>
                    <Input id="bookingId" placeholder="Enter booking ID" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter last name" />
                  </div>
                </div>
                <div className="flex justify-end items-center">
                  <Button className="gap-2">
                    <Search className="w-4 h-4" />
                    Check Booking
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="flight-status">
              <div className="space-y-6">
                <RadioGroup defaultValue="route" className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="route" id="route" />
                    <Label htmlFor="route">By Route</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="number" id="number" />
                    <Label htmlFor="number">By Flight Number</Label>
                  </div>
                </RadioGroup>
                <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="from">From</Label>
                    <Input id="from" placeholder="Departure city" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">To</Label>
                    <Input id="to" placeholder="Arrival city" />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {cities[0].date ? (
                            cities[0].date.toLocaleDateString()
                          ) : (
                            <span>Pick date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="single"
                          selected={cities[0].date}
                          onSelect={(date) => handleDateChange(0, date)}
                          numberOfMonths={1}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex justify-end items-center">
                  <Button className="gap-2">
                    <Search className="w-4 h-4" />
                    Find Flight
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
  )
}