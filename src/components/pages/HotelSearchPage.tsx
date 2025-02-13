'use client'

import { HotelFilter } from "@/components/HotelFilter"
import HotelSearch from "@/components/search/HotelSearch"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { HotelCard } from "../HotelCard"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "../ui/card"
import { useHotel } from "@/hooks/useHotel"
import { HotelOffer } from "@/types"

interface HotelSearchPageProps {
    city: string
    checkIn: string
    checkOut: string
    adults: number
    rooms: number
    page: number
    amenities?: string[]
    ratings?: string[]
    priceRange?: {
      min?: number
      max?: number
    }
    boardType?: string
    paymentPolicy?: string
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
    priceRange,
    boardType,
    paymentPolicy,
}: HotelSearchPageProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { searchHotelOffers, hotelOffers, filteredHotels, isLoading, error } = useHotel();
    const [totalPages, setTotalPages] = useState(1);

    const updatePageParam = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`/hotel/search?${params.toString()}`);
    };

    useEffect(() => {
        const fetchHotels = async () => {
            await searchHotelOffers({
                city,
                checkIn,
                checkOut,
                adults,
                rooms,
                priceRange,
                amenities,
                ratings,
                boardType,
                paymentPolicy,
                providerIds: ['serp']
            });
        };
        fetchHotels();
    }, [city, checkIn, checkOut, adults, rooms, amenities, ratings, priceRange, boardType, paymentPolicy]);

    useEffect(() => {
        if (filteredHotels?.length) {
            setTotalPages(Math.ceil(filteredHotels.length / 3));
        }
    }, [filteredHotels]);


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
            {filteredHotels
                .slice((page - 1) * 3, page * 3)
                .map((hotel: HotelOffer) => (
                    <HotelCard
                        key={hotel.id}
                        offer={hotel}
                    />
                ))}
            {totalPages > 1 && <Pagination />}
        </div>
    );

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
                    ) : filteredHotels?.length > 0 ? (
                        <HotelResults />
                    ) : (
                        <NoHotelsFound />
                    )}
                </div>
            </div>
        </>
    );
};


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