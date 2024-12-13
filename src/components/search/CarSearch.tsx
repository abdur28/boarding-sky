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

const CarSearch = () => {
     const [dates, setDates] = useState<any>({
        from: undefined,
        to: undefined,
      })

    return (
        
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

    )
}

export default CarSearch