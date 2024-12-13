'use client'

import { ChevronDown, Plane, PlaneTakeoff, PlaneLanding } from 'lucide-react'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Location {
  cityCode: string
  countryCode: string
}

interface Segment {
  departure: {
    at: string
    iataCode: string
  }
  arrival: {
    at: string
    iataCode: string
  }
  carrierCode: string
  number: string
  aircraft: {
    code: string
  }
}

interface FareDetail {
  cabin: string
  includedCheckedBags: {
    quantity: number
  }
}

interface Itinerary {
  duration: string
  segments: Segment[]
}

interface FlightCardProps {
  price: number
  itineraries: Itinerary[]
  fareDetailsBySegment: FareDetail[]
  airlines: Record<string, string>
  aircrafts: Record<string, string>
  airlineCodes: string[]
  oneWay: boolean
  origin: string
  destination: string
  locations: Record<string, Location>
}

const formatTime = (dateTime: string) => {
  const [date, time] = dateTime.split('T')
  return {
    date,
    time: time.split(':').slice(0, 2).join(':')
  }
}

const calculateLayover = (currentSegment: Segment, previousSegment: Segment) => {
  const layoverTime = new Date(currentSegment.departure.at).getTime() - 
                     new Date(previousSegment.arrival.at).getTime()
  const hours = Math.floor(layoverTime / 1000 / 60 / 60)
  const minutes = Math.floor((layoverTime / 1000 / 60) % 60)
  return `${hours}h${minutes}m`
}

const BaggageInfo = ({ fareDetail }: { fareDetail: FareDetail }) => {
  return (
    <div className="mt-3 p-2 bg-gray-50 rounded-md">
      <p className="font-medium text-xs mb-2">Baggage Information:</p>
      <div className="space-y-1 text-xs">
        <div className="flex items-start gap-2">
          <div className="min-w-4 h-4">
            💼
          </div>
          <p>Carry-on bag included (17 lbs)</p>
        </div>
        {fareDetail.includedCheckedBags.quantity > 0 && (
          <div className="flex items-start gap-2">
            <div className="min-w-4 h-4">
              🧳
            </div>
            <p>
              {fareDetail.includedCheckedBags.quantity} checked bag{fareDetail.includedCheckedBags.quantity !== 1 ? 's' : ''} included (50 lbs each)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const FlightSegmentDetails = ({
  segment,
  fareDetail,
  airlines,
  aircrafts,
  locations,
  showLayover = false,
  previousSegment = null
}: {
  segment: Segment
  fareDetail: FareDetail
  airlines: Record<string, string>
  aircrafts: Record<string, string>
  locations: Record<string, Location>
  showLayover?: boolean
  previousSegment?: Segment | null
}) => {
  const departure = formatTime(segment.departure.at)
  const arrival = formatTime(segment.arrival.at)

  return (
    <div className="flex flex-col gap-2">
      {showLayover && previousSegment && (
        <>
          <div className="border-t-2 w-full bg-muted-foreground" />
          <p className="text-sm">
            <span className="font-medium">Layover:</span> {calculateLayover(segment, previousSegment)} in{' '}
            {locations[segment.departure.iataCode]?.cityCode}, {locations[segment.departure.iataCode]?.countryCode}
          </p>
          <div className="border-t-2 w-full bg-muted-foreground" />
        </>
      )}
      <div>
        {/* Flight and Aircraft Info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">
              {airlines[segment.carrierCode]} {segment.number}
            </p>
            <p className="text-xs">
              <span className="font-medium">Aircraft:</span> {aircrafts[segment.aircraft.code]}
            </p>
          </div>
          <div className="text-xs text-right">
            <p className="font-medium">{fareDetail.cabin} Class</p>
          </div>
        </div>

        {/* Schedule Info */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <p className="font-medium flex justify-start items-center gap-1"><PlaneTakeoff className="w-4 h-4" /> Departure</p>
            <div className="space-y-0.5">
              <p>{departure.date}</p>
              <p className="text-sm font-medium">{departure.time}</p>
              <p>{segment.departure.iataCode}</p>
            </div>
          </div>
          <div className="space-y-1 text-right">
            <p className="font-medium flex justify-end items-center gap-1"><PlaneLanding className="w-4 h-4" />Arrival</p>
            <div className="space-y-0.5">
              <p>{arrival.date}</p>
              <p className="text-sm font-medium">{arrival.time}</p>
              <p>{segment.arrival.iataCode}</p>
            </div>
          </div>
        </div>

        {/* Baggage Information */}
        <BaggageInfo fareDetail={fareDetail} />
      </div>
    </div>
  )
}

const FlightRoute = ({
  itinerary,
  origin,
  destination,
  isReturn = false
}: {
  itinerary: Itinerary
  origin: string
  destination: string
  isReturn?: boolean
}) => {
  const departureSegment = itinerary.segments[0]
  const arrivalSegment = itinerary.segments[itinerary.segments.length - 1]
  const departure = formatTime(departureSegment.departure.at)
  const arrival = formatTime(arrivalSegment.arrival.at)

  return (
    <div className="flex items-center justify-between px-10 md:px-36">
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{departure.date}</p>
        <p className="text-2xl font-semibold">{departure.time}</p>
        <p className="text-sm text-muted-foreground">{isReturn ? destination : origin}</p>
      </div>
      <div className="flex-1 text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-dashed border border-third" />
          </div>
          <div className="relative flex justify-center">
            <span>
              <div className="flex flex-col items-center gap-1">
                <span className="text-muted-foreground">{itinerary.duration.split('T')[1].toLowerCase()}</span>
                <Plane 
                  className={`h-6 w-6 ${isReturn ? 'rotate-[-135deg]' : 'rotate-45'} text-first`}
                  fill="#071952"
                />
                <span>{itinerary.segments.length - 1} Stop{itinerary.segments.length - 1 !== 1 ? 's' : ''}</span>
              </div>
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 text-right">
        <p className="text-sm text-muted-foreground">{arrival.date}</p>
        <p className="text-2xl font-semibold">{arrival.time}</p>
        <p className="text-sm text-muted-foreground">{isReturn ? origin : destination}</p>
      </div>
    </div>
  )
}

const FlightCard = ({
  price,
  itineraries,
  fareDetailsBySegment,
  airlines,
  aircrafts,
  airlineCodes,
  oneWay,
  origin,
  destination,
  locations
}: FlightCardProps) => {
  const [isFirstDetailOpen, setIsFirstDetailOpen] = useState(false)
  const [isSecondDetailOpen, setIsSecondDetailOpen] = useState(false)

  return (
    <Card className="w-full">
      <CardContent className="p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2 md:gap-0">
          {/* Airline Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="/hero.png"
                alt="Airline logo"
                className="h-10 w-10 rounded-full"
              />
              <div>
                <h3 className="font-medium">
                  {airlineCodes.length > 1 ? 'Multiple Airlines' : airlines[airlineCodes[0]]}
                </h3>
              </div>
            </div>
            <div className="text-right flex flex-col w-1/5 justify-center">
              <span className="text-sm text-muted-foreground">Price</span>
              <p className="text-lg font-bold">${price}</p>
              <span className="text-xs text-muted-foreground">
                {oneWay ? 'One way' : 'Round trip'}
              </span>
            </div>
          </div>

          {/* Outbound Flight */}
          <FlightRoute 
            itinerary={itineraries[0]} 
            origin={origin} 
            destination={destination}
          />

          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col items-start">
              <span className="text-xs text-muted-foreground">Carry-on included</span>
              <Button
                variant={null}
                className="hover:text-third p-0 m-0 h-full no-underline"
                onClick={() => setIsFirstDetailOpen(!isFirstDetailOpen)}
              >
                <span className="flex items-center gap-2">
                  Flight Detail
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isFirstDetailOpen ? 'rotate-180' : ''
                    }`}
                  />
                </span>
              </Button>
            </div>
            {oneWay && <Button>Book Now</Button>}
          </div>

          {/* Outbound Flight Details */}
          {isFirstDetailOpen && (
            <div className="border-t pt-4 mt-4">
              <div className="bg-fourth py-2 px-5">
                <div className="flex flex-col gap-2">
                  {itineraries[0].segments.map((segment, index) => (
                    <FlightSegmentDetails
                      key={`outbound-${index}`}
                      segment={segment}
                      fareDetail={fareDetailsBySegment[index]}
                      airlines={airlines}
                      aircrafts={aircrafts}
                      locations={locations}
                      showLayover={index !== 0}
                      previousSegment={index !== 0 ? itineraries[0].segments[index - 1] : null}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Return Flight */}
        {!oneWay && itineraries.length > 1 && (
          <div className="space-y-4 border-t pt-4">
            <FlightRoute 
              itinerary={itineraries[1]} 
              origin={origin} 
              destination={destination}
              isReturn
            />

            <div className="flex flex-col items-start justify-between">
              <span className="text-xs text-muted-foreground">Carry-on included</span>
              <Button
                variant={null}
                className="hover:text-third p-0 m-0 h-full no-underline"
                onClick={() => setIsSecondDetailOpen(!isSecondDetailOpen)}
              >
                <span className="flex items-center gap-2">
                  Flight Detail
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isSecondDetailOpen ? 'rotate-180' : ''
                    }`}
                  />
                </span>
              </Button>
            </div>

            {/* Return Flight Details */}
            {isSecondDetailOpen && (
              <div className="border-t pt-4 mt-4">
                <div className="bg-fourth py-2 px-5">
                  <div className="flex flex-col gap-2">
                    {itineraries[1].segments.map((segment, index) => (
                      <FlightSegmentDetails
                        key={`return-${index}`}
                        segment={segment}
                        fareDetail={fareDetailsBySegment[itineraries[0].segments.length + index]}
                        airlines={airlines}
                        aircrafts={aircrafts}
                        locations={locations}
                        showLayover={index !== 0}
                        previousSegment={index !== 0 ? itineraries[1].segments[index - 1] : null}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-end">
              <Button>Book Now</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default FlightCard