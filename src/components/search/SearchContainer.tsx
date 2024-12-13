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

import FlightSearch from "@/components/search/FlightSearch"
import HotelSearch from "@/components/search/HotelSearch"
import CarSearch from "@/components/search/CarSearch"

export function SearchContainer() {
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
              Hotels
            </TabsTrigger>
            <TabsTrigger value="cars" className="gap-2">
              <Car className="w-4 h-4" />
              Car Rentals
            </TabsTrigger>
          </TabsList>
          <TabsContent value="flights">
            <FlightSearch isSearch={true}/>
          </TabsContent>
          <TabsContent value="hostels">
           <HotelSearch />
          </TabsContent>
          <TabsContent value="cars">
            <CarSearch />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    </div>
  )
}