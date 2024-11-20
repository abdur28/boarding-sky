'use client'

import { CalendarIcon, Car, Hotel, Plane, Search, Users } from 'lucide-react'
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function BookingContainer() {
  const [dates, setDates] = useState<any>({
    from: undefined,
    to: undefined,
  })

  return (
    <div className="w-full h-full px-5">
    <Card className="w-full max-w-6xl mx-auto">
      <CardContent className="p-6">
        <Tabs defaultValue="flights" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="flights" className="gap-2">
              <Plane className="w-4 h-4" />
              Flights
            </TabsTrigger>
            <TabsTrigger value="hostels" className="gap-2">
              <Hotel className="w-4 h-4" />
              Hostels
            </TabsTrigger>
            <TabsTrigger value="cars" className="gap-2">
              <Car className="w-4 h-4" />
              Car Rentals
            </TabsTrigger>
          </TabsList>
          <TabsContent value="flights">
            <div className="space-y-6">
              <RadioGroup defaultValue="roundtrip" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oneway" id="oneway" />
                  <Label htmlFor="oneway">One way</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="roundtrip" id="roundtrip" />
                  <Label htmlFor="roundtrip">Round-trip</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multicity" id="multicity" />
                  <Label htmlFor="multicity">Multi-city</Label>
                </div>
              </RadioGroup>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="from">From</Label>
                  <Input id="from" placeholder="Departure city" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <Input id="to" placeholder="Arrival city" />
                </div>
                <div className="space-y-2">
                  <Label>Dates</Label>
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
                          <span>Pick dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dates.from}
                        selected={dates}
                        onSelect={setDates}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Passengers</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <div className="flex flex-col items-start">
                          <span className="text-sm">Passengers and Class</span>
                          <span className="text-xs text-muted-foreground">2 Passengers / Business</span>
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
                              <Button variant="outline" size="icon" className="h-8 w-8">-</Button>
                              <span className="w-8 text-center">2</span>
                              <Button variant="outline" size="icon" className="h-8 w-8">+</Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Child</span>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="icon" className="h-8 w-8">-</Button>
                              <span className="w-8 text-center">0</span>
                              <Button variant="outline" size="icon" className="h-8 w-8">+</Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Infant</span>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="icon" className="h-8 w-8">-</Button>
                              <span className="w-8 text-center">0</span>
                              <Button variant="outline" size="icon" className="h-8 w-8">+</Button>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">Class</h4>
                          <RadioGroup defaultValue="business">
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
              <div className="flex justify-between items-center">
                <Input
                  className="max-w-[180px]"
                  placeholder="Enter promo code"
                />
                <Button className="gap-2">
                  <Search className="w-4 h-4" />
                  Search Flights
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="hostels">
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Where are you going?" />
                </div>
                <div className="space-y-2">
                  <Label>Check-in/out</Label>
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
                        selected={dates}
                        onSelect={setDates}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Guests</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Number of guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="3">3 Guests</SelectItem>
                      <SelectItem value="4">4 Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Room type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dorm">Dorm Bed</SelectItem>
                      <SelectItem value="private">Private Room</SelectItem>
                      <SelectItem value="family">Family Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Input
                  className="max-w-[180px]"
                  placeholder="Enter promo code"
                />
                <Button className="gap-2">
                  <Search className="w-4 h-4" />
                  Search Hostels
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="cars">
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup">Pickup location</Label>
                  <Input id="pickup" placeholder="Enter city or airport" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dropoff">Drop-off location</Label>
                  <Input id="dropoff" placeholder="Enter city or airport" />
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
                        selected={dates}
                        onSelect={setDates}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Car type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select car type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Pickup time</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }).map((_, i) => (
                          <SelectItem key={i} value={`${i}:00`}>
                            {`${i.toString().padStart(2, '0')}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Return time</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }).map((_, i) => (
                          <SelectItem key={i} value={`${i}:00`}>
                            {`${i.toString().padStart(2, '0')}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Input
                  className="max-w-[180px]"
                  placeholder="Enter promo code"
                />
                <Button className="gap-2">
                  <Search className="w-4 h-4" />
                  Search Cars
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    </div>
  )
}