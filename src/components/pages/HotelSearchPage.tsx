'use client'

import { HotelFilter } from "@/components/HotelFilter"
import HotelSearch from "@/components/search/HotelSearch"
import { useAmadeus } from "@/hooks/useAmadeus"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { HotelCard } from "../HotelCard"
import { useRouter, useSearchParams } from "next/navigation"

interface HotelSearchPageProps {
    city: string
    checkIn: string
    checkOut: string
    adults: number
    rooms: number
    page: number
    amenities?: Array<string>
    ratings?: Array<string>
}

const HotelSearchPage = ({
    city,
    checkIn,
    checkOut,
    adults,
    rooms,
    page,
    amenities,
    ratings,
}: HotelSearchPageProps) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { getHotels, hotels, isLoading } = useAmadeus()
    const [error, setError] = useState<string | null>(null)
    const [totalPages, setTotalPages] = useState(1)

    // Function to update URL with new page number
    const updatePageParam = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', newPage.toString())
        router.push(`/hotel/search?${params.toString()}`)
    }

    useEffect(() => {
        const fetchHotels =  () => {
            getHotels(
                city,
                checkIn,
                checkOut,
                adults,
                rooms,
                page,
                amenities,
                ratings
            )     
        }
        fetchHotels()
    }, [city, checkIn, checkOut, adults, rooms, page, amenities, ratings])

    useEffect(() => {
        if (hotels?.length) {
            // console.log(hotels)
            setTotalPages(Math.ceil(hotels.length / 3)) // Since we're getting 3 hotels per page
        }
    }, [hotels])

    const Pagination = () => {
        const getPageNumbers = () => {
            const maxPages = Math.min(5, totalPages)
            let start = page > 2 ? page - 2 : 1
            start = Math.min(start, totalPages - maxPages + 1)
            start = Math.max(start, 1)

            return Array.from({ length: maxPages }, (_, i) => start + i)
                .filter(pageNum => pageNum <= totalPages)
        }

        return (
            <div className="w-full flex justify-center items-center gap-2 my-6">
                {page > 1 && (
                    <button
                        onClick={() => updatePageParam(page - 1)}
                        className="w-10 h-10 rounded-full flex justify-center items-center text-second hover:scale-110 transition-transform"
                        aria-label="Previous page"
                    >
                        <ArrowLeft />
                    </button>
                )}
                {getPageNumbers().map((pageNumber, index) => (
                    <button
                        key={pageNumber}
                        onClick={() => updatePageParam(pageNumber)}
                        className={`w-10 h-10 rounded-full flex justify-center items-center hover:bg-second hover:text-white text-second border border-second transition-colors
                            ${page == pageNumber ? "bg-second text-white" : ""}`}
                        aria-label={`Page ${pageNumber}`}
                        aria-current={page === pageNumber ? 'page' : undefined}
                    >
                        {pageNumber}
                    </button>
                ))}
                {page < totalPages && (
                    <button
                        onClick={() => updatePageParam(page + 1)}
                        className="w-10 h-10 rounded-full flex justify-center items-center text-second hover:scale-110 transition-transform"
                        aria-label="Next page"
                    >
                        <ArrowRight />
                    </button>
                )}
            </div>
        )
    }

    const HotelResults = () => (
        
        <div className="w-full flex flex-col gap-5">
            {hotels.slice((page - 1) * 3, hotels.length > (page - 1) * 3 + 3 ? (page - 1) * 3 + 3 : hotels.length).map((hotel: any) => (
                <HotelCard
                    key={hotel.hotel.hotelId}
                    name={hotel.hotel.name}
                    location={hotel.hotel.cityCode}
                    description={hotel.hotel.description}
                    images={['/hero.png', '/hero.png', '/hero.png']}
                    amenities={hotel.hotel.amenities}
                    rating={hotel.rating}
                    pricing={hotel.offers[0].price}
                    badges={hotel.hotel.badges}
                    refundable={hotel.offers[0]?.refundable}
                />
            ))}
            {totalPages > 1 && <Pagination />}
        </div>
    )

    return (
        <>
            <div className="w-full flex flex-col justify-center items-center mb-10">
                <div className="w-full">
                    <div className="w-full h-full px-5">
                        <Card className="w-full max-w-6xl mx-auto">
                            <CardContent className="p-6">
                                <HotelSearch />
                            </CardContent> 
                        </Card>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl w-full relative flex flex-col lg:flex-row gap-10 lg:gap-5 justify-center px-5 mb-10">
                <div className="w-full lg:w-1/4 lg:sticky top-20 h-max">
                    <HotelFilter />
                </div>
                <div className="w-full lg:w-3/4 flex flex-col gap-6">
                    <h1 className="text-2xl font-semibold">Recommended Hotels</h1>
                    {error && <ErrorState message={error} />}
                    {isLoading ? (
                        <LoadingState />
                    ) : hotels?.length > 0 ? (
                        <HotelResults />
                    ) : (
                        <NoHotelsFound />
                    )}
                </div>
            </div>
        </>
    )
}

// Component for loading state
const LoadingState = () => (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Searching for the best Hotels...</p>
    </div>
)

// Component for error state
const ErrorState = ({ message }: { message: string }) => (
    <Alert variant="destructive" className="my-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
    </Alert>
)

// Component for no results state
const NoHotelsFound = () => (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-semibold text-muted-foreground">No Hotels found</p>
        <p className="text-muted-foreground">Try adjusting your search criteria or selecting different dates</p>
    </div>
)

export default HotelSearchPage