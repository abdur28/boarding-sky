'use client'

import FlightCard from "@/components/FlightCard"
import { FlightFilter } from "@/components/FlightFilter"
import FlightSearch from "@/components/search/FlightSearch"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { useFlight } from "@/hooks/useFlight"
import { FlightOffer } from "@/types"

interface FlightSearchPageProps {
    providerIds: Array<string>
    origin: string
    destination: string
    adults: number
    children: number
    infants: number
    travelClass: string
    departureDate: string
    returnDate?: string
}

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
}: FlightSearchPageProps) => {
    const { searchFlightOffers, flightOffers, filteredFlights, setFilteredFlights, isLoading, error } = useFlight()
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        const fetchFlights = async () => {
            console.log({ providerIds, origin, destination, adults, children, infants, travelClass, departureDate, returnDate });
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
        }

        fetchFlights()
    }, [
        searchFlightOffers,
        providerIds,
        origin,
        destination,
        adults,
        children,
        infants,
        travelClass,
        departureDate,
        returnDate
    ])

    useEffect(() => {
        const total = filteredFlights.length > 0 ? Math.ceil(filteredFlights.length / limit) : 1
        setTotalPages(total)
        setPage(1)
    }, [filteredFlights, limit])

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
            const pages: number[] = []
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
        const currentPageOffers = filteredFlights.slice(startIndex, endIndex)

        return (
            <div className="w-full flex flex-col gap-5">
                {currentPageOffers.map((offer: FlightOffer) => (
                    <FlightCard
                        key={offer.id}
                        offer={JSON.stringify(offer)}
                        origin={origin}
                        destination={destination}
                    />
                ))}
                {filteredFlights.length > limit && <Pagination />}
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
                        offers={flightOffers}
                        setFilteredOffers={setFilteredFlights}
                        loading={isLoading}
                    />
                </div>
                <div className="w-full lg:w-3/4 flex flex-col gap-6">
                    <h1 className="text-2xl font-semibold">Recommended flights</h1>
                    {error && <ErrorState message={error} />}
                    {isLoading ? (
                        <LoadingState />
                    ) : filteredFlights.length > 0 ? (
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
