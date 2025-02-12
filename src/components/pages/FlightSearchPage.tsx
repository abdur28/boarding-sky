'use client'

import FlightCard from "@/components/FlightCard"
import { FlightFilter } from "@/components/FlightFilter"
import FlightSearch from "@/components/search/FlightSearch"
import { useAmadeus } from "@/hooks/useAmadeus"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent } from "../ui/card"
import { useFlight } from "@/hooks/useFlight"

const FlightSearchPage = ({
    providerIds,
    origin, 
    destination, 
    adults, 
    children, 
    infants, 
    travelClass, 
    departureDate, 
    returnDate,
}:{
    providerIds: Array<string>,
    origin: string,
    destination: string,
    adults: number,
    children: number,
    infants: number,
    travelClass: string,
    departureDate: string,
    returnDate?: string,
}) => {
    const { flightOfferSearch, flightsOffers } = useAmadeus()
    const [offers, setOffers] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [airlines, setAirlines] = useState<any>({})
    const [aircrafts, setAircrafts] = useState<any>({})
    const [locations, setLocations] = useState<any>([])
    const [filteredOffers, setFilteredOffers] = useState<any>([])

    const {searchFlightOffers,flightOffers, isLoading} = useFlight()

    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                setLoading(true)
                setError(null)
                await searchFlightOffers({                    
                    providerIds: ['amadeus'],
                    origin,
                    destination,
                    adults,
                    children,
                    infants,
                    travelClass,
                    departureDate,
                    returnDate
                })
                console.log('Flight offers:', flightOffers)
            } catch (err) {
                setError('Failed to fetch flight offers. Please try again.')
                console.error('Flight search error:', err)
            }
        }

        fetchFlights()
    }, [origin, destination, adults, children, infants, travelClass, departureDate, returnDate])

    useEffect(() => {
        if (flightsOffers) {
            try {
                setOffers(flightsOffers.data || [])
                setFilteredOffers(flightsOffers.data || [])
                setAirlines(flightsOffers.dictionaries?.carriers || {})
                setAircrafts(flightsOffers.dictionaries?.aircraft || {})
                setLocations(flightsOffers.dictionaries?.locations || {})
            } catch (err) {
                setError('Error processing flight data')
                console.error('Data processing error:', err)
            }
        }
    }, [flightsOffers])

    useEffect(() => {
        if (!isLoading) {
            setLoading(false)
        }
    }, [isLoading])

    useEffect(() => {
        const total = filteredOffers.length > 0 ? Math.ceil(filteredOffers.length / limit) : 1
        setTotalPages(total)
        setPage(1)
    }, [filteredOffers, limit])

    const LoadingState = () => (
        <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Searching for the best flights...</p>
        </div>
    )

    const ErrorState = ({ message }: { message: string }) => (
        <Alert variant="destructive" className="my-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    )

    const NoFlightsFound = () => (
        <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-4">
            <p className="text-xl font-semibold text-muted-foreground">No flights found</p>
            <p className="text-muted-foreground">Try adjusting your search criteria or selecting different dates</p>
        </div>
    )

    const Pagination = () => {
        const getPageNumbers = () => {
            let pages = []
            const maxPages = Math.min(5, totalPages)
            let start = page > 2 ? page - 2 : 1
            start = Math.min(start, totalPages - maxPages + 1)
            start = Math.max(start, 1)

            for (let i = 0; i < maxPages; i++) {
                const pageNum = start + i
                if (pageNum <= totalPages) {
                    pages.push(pageNum)
                }
            }
            return pages
        }

        return (
            <div className="w-full flex justify-center items-center gap-2 my-6">
                {page > 1 && (
                    <button
                        onClick={() => setPage(page - 1)}
                        className="w-10 h-10 rounded-full flex justify-center items-center text-second hover:scale-110 transition-transform"
                        aria-label="Previous page"
                    >
                        <ArrowLeft />
                    </button>
                )}
                {getPageNumbers().map((pageNumber) => (
                    <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`w-10 h-10 rounded-full flex justify-center items-center hover:bg-second hover:text-white text-second border border-second transition-colors
                            ${page === pageNumber ? "bg-second text-white" : ""}`}
                        aria-label={`Page ${pageNumber}`}
                        aria-current={page === pageNumber ? 'page' : undefined}
                    >
                        {pageNumber}
                    </button>
                ))}
                {page < totalPages && (
                    <button
                        onClick={() => setPage(page + 1)}
                        className="w-10 h-10 rounded-full flex justify-center items-center text-second hover:scale-110 transition-transform"
                        aria-label="Next page"
                    >
                        <ArrowRight />
                    </button>
                )}
            </div>
        )
    }

    const FlightResults = () => {
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const currentPageOffers = filteredOffers.slice(startIndex, endIndex)

        return (
            <div className="w-full flex flex-col gap-5">
                {currentPageOffers.map((offer: any) => (
                    <FlightCard
                        id={offer.id}
                        key={offer.id}
                        price={offer.price?.grandTotal}
                        itineraries={offer.itineraries}
                        fareDetailsBySegment={offer.travelerPricings[0].fareDetailsBySegment}
                        airlines={airlines}
                        aircrafts={aircrafts}
                        oneWay={offer.itineraries.length === 1}
                        airlineCodes={offer.validatingAirlineCodes}
                        origin={origin}
                        destination={destination}
                        locations={locations}
                    />
                ))}
                {filteredOffers.length > limit && <Pagination />}
            </div>
        )
    }

    return (
        <>
            <div className="w-full flex flex-col justify-center items-center mb-10">
                <div className="w-full">
                    <div className="w-full h-full px-5">
                        <Card className="w-full max-w-6xl mx-auto">
                            <CardContent className="p-6">
                                <FlightSearch isSearch={false}/>
                            </CardContent> 
                        </Card>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl w-full relative flex flex-col lg:flex-row gap-10 lg:gap-5 justify-center px-5 mb-10">
                <div className="w-full lg:w-1/4 lg:sticky top-20 h-max">
                    <FlightFilter
                        offers={offers}
                        setFilteredOffers={setFilteredOffers}
                        airlines={airlines}
                        loading={isLoading}
                    />
                </div>
                <div className="w-full lg:w-3/4 flex flex-col gap-6">
                    <h1 className="text-2xl font-semibold">Recommended flights</h1>
                    {error && <ErrorState message={error} />}
                    {isLoading ? (
                        <LoadingState />
                    ) : filteredOffers.length > 0 ? (
                        <FlightResults />
                    ) : (
                        <NoFlightsFound />
                    )}
                </div>
            </div>
        </>
    )
}

export default FlightSearchPage