'use client'

import { ChevronDown, Plane, PlaneTakeoff, PlaneLanding } from 'lucide-react'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { FareDetail, FlightOffer, FlightSegment, Itinerary } from '@/types'

interface FlightCardProps {
  id: string
  price: number
  itineraries: Array<Itinerary>
  fareDetailsBySegment: Array<FareDetail>
  airlines: Record<string, string>
  aircrafts: Record<string, string>
  airlineCodes: Array<string>
  oneWay: boolean
  origin: string
  destination: string
  locations: Record<string, {
    cityCode: string;
    countryCode: string;
  }>;
  providerId: string
  refundable?: boolean
}


const formatTime = (dateTime: string) => {
  const [date, time] = dateTime.split('T')
  return {
    date,
    time: time.split(':').slice(0, 2).join(':')
  }
}

const calculateLayover = (currentSegment: FlightSegment, previousSegment: FlightSegment) => {
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
        {fareDetail.baggage.cabin && (
          <div className="flex items-start gap-2">
            <div className="min-w-4 h-4">💼</div>
            <p>
              Carry-on bag ({fareDetail.baggage.cabin.quantity}){' '}
              {fareDetail.baggage.cabin.weight && (
                <span>up to {fareDetail.baggage.cabin.weight} {fareDetail.baggage.cabin.weightUnit}</span>
              )}
            </p>
          </div>
        )}
        {fareDetail.baggage.checked && (
          <div className="flex items-start gap-2">
            <div className="min-w-4 h-4">🧳</div>
            <p>
              {fareDetail.baggage.checked.quantity} checked bag{fareDetail.baggage.checked.quantity !== 1 ? 's' : ''}{' '}
              {fareDetail.baggage.checked.weight && (
                <span>up to {fareDetail.baggage.checked.weight} {fareDetail.baggage.checked.weightUnit}</span>
              )}
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
  segment: FlightSegment;
  fareDetail: FareDetail;
  airlines: Record<string, string>;
  aircrafts: Record<string, string>;
  locations: Record<string, {
    cityCode: string;
    countryCode: string;
  }>;
  showLayover?: boolean;
  previousSegment?: FlightSegment | null;
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
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">
              {airlines[segment.carrierCode]} {segment.number}
              {segment.operating && segment.operating.carrierCode !== segment.carrierCode && (
                <span className="text-xs ml-2 text-muted-foreground">
                  Operated by {airlines[segment.operating.carrierCode]}
                </span>
              )}
            </p>
            <p className="text-xs">
              <span className="font-medium">Aircraft:</span> {segment.aircraft.name || aircrafts[segment.aircraft.code]}
            </p>
          </div>
          <div className="text-xs text-right">
            <p className="font-medium">{fareDetail.cabin} Class</p>
            {fareDetail.class && <p className="text-muted-foreground">Class {fareDetail.class}</p>}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <p className="font-medium flex justify-start items-center gap-1">
              <PlaneTakeoff className="w-4 h-4" /> Departure
            </p>
            <div className="space-y-0.5">
              <p>{departure.date}</p>
              <p className="text-sm font-medium">{departure.time}</p>
              <p>{segment.departure.iataCode}</p>
              {segment.departure.terminal && (
                <p className="text-muted-foreground">Terminal {segment.departure.terminal}</p>
              )}
            </div>
          </div>
          <div className="space-y-1 text-right">
            <p className="font-medium flex justify-end items-center gap-1">
              <PlaneLanding className="w-4 h-4" />Arrival
            </p>
            <div className="space-y-0.5">
              <p>{arrival.date}</p>
              <p className="text-sm font-medium">{arrival.time}</p>
              <p>{segment.arrival.iataCode}</p>
              {segment.arrival.terminal && (
                <p className="text-muted-foreground">Terminal {segment.arrival.terminal}</p>
              )}
            </div>
          </div>
        </div>

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
  offer,
  origin,
  destination,
  departureDate,
  returnDate
}: { offer: string, origin: string, destination: string, departureDate: string, returnDate?: string}) => {
  const [isFirstDetailOpen, setIsFirstDetailOpen] = useState(false)
  const [isSecondDetailOpen, setIsSecondDetailOpen] = useState(false)
  const router = useRouter()
  const flightOffer: FlightOffer  = JSON.parse(offer)
  console.log(flightOffer);
  const flightCardProps: FlightCardProps = {
    providerId:flightOffer.providerId,
    id:flightOffer.id!,
    price:flightOffer.price.amount,
    itineraries:flightOffer.itineraries,
    fareDetailsBySegment:flightOffer.fareDetails,
    airlines:flightOffer.dictionaries?.carriers || {},
    aircrafts:flightOffer.dictionaries?.aircraft || {},
    oneWay:flightOffer.itineraries.length === 1,
    airlineCodes:[flightOffer.meta.validatingCarrier],
    origin,
    destination,
    locations:flightOffer.dictionaries?.locations || {},
  }

  const {
    providerId,
    id,
    price,
    itineraries,
    fareDetailsBySegment,
    airlines,
    aircrafts,
    oneWay,
    airlineCodes,
    locations
  } = flightCardProps


  const handleBooking = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/flight/booking?offerId=${flightOffer.id}&origin=${origin}&destination=${destination}`
      +`&departureDate=${departureDate}&returnDate=${returnDate}`
      +`&adults=${flightOffer.passengers.adults}&children=${flightOffer.passengers.children}&infants=${flightOffer.passengers.infants}`
      +`&travelClass=${flightOffer.travelClass}&providerId=${flightOffer.providerId}`
    )
  }

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2 md:gap-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="/hero.png"
                alt="Airline logo"
                className="h-10 w-10 rounded-full"
              />
              <div className="space-y-1">
                <h3 className="font-medium">
                  {airlineCodes.length > 1 ? 'Multiple Airlines' : airlines[airlineCodes[0]]}
                </h3>
                <div className="flex gap-2">
                  {providerId && (
                    <Badge variant="outline" className="text-xs">
                      {providerId}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right flex flex-col w-1/5 justify-center">
              <span className="text-sm text-muted-foreground">Price</span>
              <p className="text-lg font-bold">${price.toFixed(2)}</p>
              <span className="text-xs text-muted-foreground">
                {oneWay ? 'One way' : 'Round trip'}
              </span>
            </div>
          </div>

          <FlightRoute 
            itinerary={itineraries[0]} 
            origin={origin} 
            destination={destination}
          />

          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col items-start">
              <span className="text-xs text-muted-foreground">
                {fareDetailsBySegment[0].baggage.cabin?.quantity} carry-on included
              </span>
              <Button
                variant="ghost"
                className="hover:text-third p-0 h-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFirstDetailOpen(!isFirstDetailOpen);
                }}
              >
                <span className="flex items-center gap-2">
                  Flight Detail
                  <ChevronDown className={`h-4 w-4 transition-transform ${isFirstDetailOpen ? 'rotate-180' : ''}`} />
                </span>
              </Button>
            </div>
            {oneWay && (
              <Button onClick={handleBooking}>
                Book Now
              </Button>
            )}
          </div>

          {isFirstDetailOpen && (
            <div className="border-t pt-4 mt-4">
              <div className="bg-fourth py-2 px-5">
                <div className="flex flex-col gap-2">
                  {itineraries[0].segments.map((segment, segmentIndex) => (
                    <FlightSegmentDetails
                      key={`${id}-outbound-${segmentIndex}`} // Changed key to be unique
                      segment={segment}
                      fareDetail={fareDetailsBySegment[segmentIndex]}
                      airlines={airlines}
                      aircrafts={aircrafts}
                      locations={locations}
                      showLayover={segmentIndex !== 0}
                      previousSegment={segmentIndex !== 0 ? itineraries[0].segments[segmentIndex - 1] : null}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {!oneWay && itineraries.length > 1 && (
          <div className="space-y-4 border-t pt-4">
            <FlightRoute 
              itinerary={itineraries[1]} 
              origin={origin} 
              destination={destination}
              isReturn
            />

            <div className="flex flex-col items-start justify-between">
              <span className="text-xs text-muted-foreground">
                {fareDetailsBySegment[itineraries[0].segments.length].baggage.cabin?.quantity} carry-on included
              </span>
              <Button
                variant="ghost"
                className="hover:text-third p-0 h-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSecondDetailOpen(!isSecondDetailOpen);
                }}
              >
                <span className="flex items-center gap-2">
                  Flight Detail
                  <ChevronDown className={`h-4 w-4 transition-transform ${isSecondDetailOpen ? 'rotate-180' : ''}`} />
                </span>
              </Button>
            </div>

            {!oneWay && itineraries.length > 1 && isSecondDetailOpen && (
              <div className="border-t pt-4 mt-4">
                <div className="bg-fourth py-2 px-5">
                  <div className="flex flex-col gap-2">
                    {itineraries[1].segments.map((segment, segmentIndex) => {
                      const fareDetailIndex = itineraries[0].segments.length + segmentIndex;
                      return (
                        <FlightSegmentDetails
                          key={`${id}-return-${segmentIndex}`} // Changed key to be unique
                          segment={segment}
                          fareDetail={fareDetailsBySegment[fareDetailIndex]}
                          airlines={airlines}
                          aircrafts={aircrafts}
                          locations={locations}
                          showLayover={segmentIndex !== 0}
                          previousSegment={segmentIndex !== 0 ? itineraries[1].segments[segmentIndex - 1] : null}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-end">
            <Button onClick={handleBooking}>
                Book Now
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default FlightCard