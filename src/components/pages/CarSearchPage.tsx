'use client'

import { CarFilter } from "@/components/CarFilter"
import CarSearch from "@/components/search/CarSearch"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CarCard } from "@/components/CarCard"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { useCar } from "@/hooks/useCar"
import { CarOffer } from "@/types"

interface CarSearchPageProps {
    pickUpLocation: string
    dropOffLocation?: string
    pickUpDate: string
    dropOffDate: string
    pickUpTime: string;    
    dropOffTime: string;  
    page: number
    priceRangeStr?: string
    transmission?: string[]
    category?: string[]
    features?: string[]
    fuelType?: string[]
    vendor?: string[]
}

const CarSearchPage = ({
    pickUpLocation,
    dropOffLocation,
    pickUpDate,
    dropOffDate,
    pickUpTime,        
    dropOffTime, 
    page = 1,
    priceRangeStr,
    transmission,
    category,
    features,
    fuelType,
    vendor
}: CarSearchPageProps) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { searchCarOffers, carOffers, filteredCars, isLoading, error, applyFilters } = useCar()
    const [totalPages, setTotalPages] = useState(1)

    const updatePageParam = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', newPage.toString())
        router.push(`/car/search?${params.toString()}`)
    }

    useEffect(() => {
        const fetchCars = async () => {
            const params = {
                pickUpLocation,
                dropOffLocation,
                pickUpDate,
                dropOffDate,
                pickUpTime,   
                dropOffTime, 
            }

            await searchCarOffers(params)

            // Apply filters after fetching cars
            if (priceRangeStr || transmission?.length || category?.length || 
                features?.length || fuelType?.length || vendor?.length) {
                const [min, max] = priceRangeStr ? priceRangeStr.split('-').map(Number) : [undefined, undefined]
                
                applyFilters({
                    priceRange: priceRangeStr ? { min, max } : undefined,
                    transmission,
                    category,
                    features,
                    fuelType,
                    vendor
                })
            }
        }
        fetchCars()
    }, [pickUpLocation, dropOffLocation, pickUpDate, dropOffDate, pickUpTime, dropOffTime,
        priceRangeStr, transmission, category, features, fuelType, vendor])

    useEffect(() => {
        if (filteredCars?.length) {
            setTotalPages(Math.ceil(filteredCars.length / 5))
        }
    }, [filteredCars])

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
                        className="w-10 h-10 rounded-full flex justify-center items-center text-primary hover:scale-110 transition-transform"
                        aria-label="Previous page"
                    >
                        <ArrowLeft />
                    </button>
                )}
                {getPageNumbers().map((pageNumber) => (
                    <button
                        key={pageNumber}
                        onClick={() => updatePageParam(pageNumber)}
                        className={`w-10 h-10 rounded-full flex justify-center items-center hover:bg-primary hover:text-white text-primary border border-primary transition-colors
                            ${page === pageNumber ? "bg-primary text-white" : ""}`}
                        aria-label={`Page ${pageNumber}`}
                        aria-current={page === pageNumber ? 'page' : undefined}
                    >
                        {pageNumber}
                    </button>
                ))}
                {page < totalPages && (
                    <button
                        onClick={() => updatePageParam(page + 1)}
                        className="w-10 h-10 rounded-full flex justify-center items-center text-primary hover:scale-110 transition-transform"
                        aria-label="Next page"
                    >
                        <ArrowRight />
                    </button>
                )}
            </div>
        )
    }

    const CarResults = () => (
        <div className="w-full flex flex-col gap-5">
            {filteredCars
                .slice((page - 1) * 5, page * 5)
                .map((car: CarOffer) => (
                    <CarCard 
                        key={car.id}
                        offer={car}
                        searchParams={{
                            pickupDate: pickUpDate,
                            dropoffDate: dropOffDate,
                            pickupLocation: pickUpLocation,
                            dropoffLocation: dropOffLocation,
                            pickupTime: pickUpTime,    
                            dropoffTime: dropOffTime,    
                        }}
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
                                <CarSearch />
                            </CardContent> 
                        </Card>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl w-full relative flex flex-col lg:flex-row gap-10 lg:gap-5 justify-center px-5 mb-10">
                <div className="w-full lg:w-1/4 lg:sticky top-20 h-max">
                    <CarFilter loading={isLoading} />
                </div>
                <div className="w-full lg:w-3/4 flex flex-col gap-6">
                    <h1 className="text-2xl font-semibold">Available Vehicles</h1>
                    {error && <ErrorState message={error} />}
                    {isLoading ? (
                        <LoadingState />
                    ) : filteredCars?.length > 0 ? (
                        <CarResults />
                    ) : (
                        <NoCarsFound />
                    )}
                </div>
            </div>
        </>
    )
}

const LoadingState = () => (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Searching for available vehicles...</p>
    </div>
)

const ErrorState = ({ message }: { message: string }) => (
    <Alert variant="destructive" className="my-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
    </Alert>
)

const NoCarsFound = () => (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-semibold text-muted-foreground">No vehicles found</p>
        <p className="text-muted-foreground">Try adjusting your search criteria or selecting different dates</p>
    </div>
)

export default CarSearchPage