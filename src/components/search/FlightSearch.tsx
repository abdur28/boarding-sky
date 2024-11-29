'use client'

import { CalendarIcon, Car, Hotel, Plane, Search, Users, TicketsPlane } from 'lucide-react'
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
import { useAmadeus } from '@/hooks/useAmadeus'

export function FlightSearch() {
  const [dates, setDates] = useState<any>({
    from: undefined,
    to: undefined,
  })
  const [date, setDate] = useState<any>(undefined)


  return (
    <div className="w-full h-full px-5">
    <Card className="w-full max-w-6xl mx-auto">
      <CardContent className="p-6">
        <Tabs defaultValue="flights" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="flights" className="gap-2">
              Flight
            </TabsTrigger>
            <TabsTrigger value="manage-booking" className="gap-2">
              Manage Booking
            </TabsTrigger>
            <TabsTrigger value="flight-status" className="gap-2">
              Flight Status
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
              <div className="grid gap-6 md:grid-cols-3">
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
                
              </div>
              <div className='grid gap-6 md:grid-cols-3'>
                <div className="space-y-2">
                  <Label>Passengers</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <div className="flex flex-col items-start">
                          <span className="text-muted-foreground">2 Adults, 1 Child</span>
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
                          <span className=" text-muted-foreground">Business</span>
                        </div>
                        <TicketsPlane className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid gap-4">
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
              <div className="flex justify-end items-center">
                <Button className="gap-2">
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
              <RadioGroup defaultValue="roundtrip" className="flex gap-4">
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
                        {date ? (
                            date.toLocaleDateString()
                        ) : (
                          <span>Pick dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="single"
                        defaultMonth={date}
                        selected={date}
                        onSelect={setDate}
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
      </CardContent>
    </Card>
    </div>
  )
}