'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FlightOffer } from "@/types"

interface FilterSection {
    id: string
    title: string
    content: React.ReactNode
}

interface FilterState {
    price: string
    airlines: string[]
    stops: string[]
    departureTime: string[]
    arrivalTime: string[]
}

interface FlightFilterProps {
    offers: FlightOffer[]
    setFilteredOffers: (offers: FlightOffer[]) => void
    loading: boolean
}

const TIME_RANGES = [
    { label: '00:00 - 05:59', time: 'Early morning' },
    { label: '06:00 - 11:59', time: 'Morning' },
    { label: '12:00 - 17:59', time: 'Afternoon' },
    { label: '18:00 - 23:59', time: 'Evening' }
]

export function FlightFilter({ offers, setFilteredOffers, loading }: FlightFilterProps) {
    const [expandedSections, setExpandedSections] = useState<string[]>([''])
    const [filters, setFilters] = useState<FilterState>({
        price: 'recommended',
        airlines: [],
        stops: [],
        departureTime: [],
        arrivalTime: []
    })

    const getAirlines = () => {
        const airlinesSet = new Set<string>()
        offers.forEach(offer => {
            offer.itineraries.forEach(itinerary => {
                itinerary.segments.forEach(segment => {
                    if (segment.carrierCode) {
                        airlinesSet.add(segment.carrierCode)
                    }
                })
            })
        })
        return Array.from(airlinesSet)
    }

    const isTimeInRange = (time: string, range: string) => {
        const hour = parseInt(time.split(':')[0])
        switch (range) {
            case 'Early morning': return hour >= 0 && hour < 6
            case 'Morning': return hour >= 6 && hour < 12
            case 'Afternoon': return hour >= 12 && hour < 18
            case 'Evening': return hour >= 18 && hour < 24
            default: return false
        }
    }

    useEffect(() => {
        if (!offers?.length) return

        let newFilteredOffers = [...offers]

        // Price sorting
        if (filters.price === 'highest') {
            newFilteredOffers.sort((a, b) => b.price.amount - a.price.amount)
        } else if (filters.price === 'lowest') {
            newFilteredOffers.sort((a, b) => a.price.amount - b.price.amount)
        }

        // Airline filtering
        if (filters.airlines.length > 0) {
            newFilteredOffers = newFilteredOffers.filter(offer => 
                offer.itineraries.some(itinerary =>
                    itinerary.segments.some(segment =>
                        filters.airlines.includes(segment.carrierCode)
                    )
                )
            )
        }

        // Stops filtering
        if (filters.stops.length > 0) {
            newFilteredOffers = newFilteredOffers.filter(offer => {
                return offer.itineraries.some(itinerary => {
                    const numStops = itinerary.segments.length - 1
                    const stopLabel = numStops === 0 ? 'Non-stop' :
                                   numStops === 1 ? '1 Stop' :
                                   '2+ Stops'
                    return filters.stops.includes(stopLabel)
                })
            })
        }

        // Departure time filtering
        if (filters.departureTime.length > 0) {
            newFilteredOffers = newFilteredOffers.filter(offer =>
                offer.itineraries.some(itinerary => {
                    const departureTime = itinerary.segments[0].departure.at.split('T')[1]
                    return filters.departureTime.some(range => isTimeInRange(departureTime, range))
                })
            )
        }

        // Arrival time filtering
        if (filters.arrivalTime.length > 0) {
            newFilteredOffers = newFilteredOffers.filter(offer =>
                offer.itineraries.some(itinerary => {
                    const lastSegment = itinerary.segments[itinerary.segments.length - 1]
                    const arrivalTime = lastSegment.arrival.at.split('T')[1]
                    return filters.arrivalTime.some(range => isTimeInRange(arrivalTime, range))
                })
            )
        }

        setFilteredOffers(newFilteredOffers)
    }, [filters, offers, setFilteredOffers])

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        )
    }

    const handleCheckboxChange = (type: keyof FilterState, value: string) => {
        setFilters(prev => {
            const currentValues = prev[type] as string[]
            return {
                ...prev,
                [type]: currentValues.includes(value)
                    ? currentValues.filter(v => v !== value)
                    : [...currentValues, value]
            }
        })
    }

    const filterSections: FilterSection[] = [
        {
            id: 'price',
            title: 'Price',
            content: (
                <RadioGroup 
                    value={filters.price} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, price: value }))} 
                    className="flex flex-col gap-2"
                >
                    {[
                        { value: 'recommended', label: 'Recommended' },
                        { value: 'highest', label: 'Highest to Lowest' },
                        { value: 'lowest', label: 'Lowest to Highest' }
                    ].map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <Label htmlFor={option.value}>{option.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            ),
        },
        {
            id: 'airlines',
            title: 'Airlines',
            content: (
                <div className="space-y-2">
                    {getAirlines().map(airline => (
                        <div key={airline} className="flex items-center space-x-2">
                            <Checkbox 
                                id={airline}
                                checked={filters.airlines.includes(airline)}
                                onCheckedChange={() => handleCheckboxChange('airlines', airline)}
                            />
                            <Label htmlFor={airline}>
                                {offers[0]?.dictionaries?.carriers?.[airline] || airline}
                            </Label>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            id: 'stops',
            title: 'Stops',
            content: (
                <div className="space-y-2">
                    {['Non-stop', '1 Stop', '2+ Stops'].map(stop => (
                        <div key={stop} className="flex items-center space-x-2">
                            <Checkbox 
                                id={stop}
                                checked={filters.stops.includes(stop)}
                                onCheckedChange={() => handleCheckboxChange('stops', stop)}
                            />
                            <Label htmlFor={stop}>{stop}</Label>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            id: 'departure',
            title: 'Departure Time',
            content: (
                <div className="space-y-2">
                    {TIME_RANGES.map(({ label, time }) => (
                        <div key={time} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`departure-${time}`}
                                checked={filters.departureTime.includes(time)}
                                onCheckedChange={() => handleCheckboxChange('departureTime', time)}
                            />
                            <Label htmlFor={`departure-${time}`} className="text-sm">
                                {label}
                                <span className="ml-1 text-muted-foreground">({time})</span>
                            </Label>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            id: 'arrival',
            title: 'Arrival Time',
            content: (
                <div className="space-y-2">
                    {TIME_RANGES.map(({ label, time }) => (
                        <div key={time} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`arrival-${time}`}
                                checked={filters.arrivalTime.includes(time)}
                                onCheckedChange={() => handleCheckboxChange('arrivalTime', time)}
                            />
                            <Label htmlFor={`arrival-${time}`} className="text-sm">
                                {label}
                                <span className="ml-1 text-muted-foreground">({time})</span>
                            </Label>
                        </div>
                    ))}
                </div>
            ),
        },
    ]

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Filter Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {filterSections.map(section => (
                    <div key={section.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <Button
                            variant="ghost"
                            className="w-full justify-between font-medium"
                            onClick={() => toggleSection(section.id)}
                        >
                            {section.title}
                            <ChevronDown
                                className={`h-4 w-4 transition-transform ${
                                    expandedSections.includes(section.id) ? 'rotate-180' : ''
                                }`}
                            />
                        </Button>
                        {expandedSections.includes(section.id) && (
                            <div className="mt-4">{section.content}</div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}