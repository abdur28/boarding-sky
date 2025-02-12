'use client'

import Header from "@/components/Header"
import FlightSearch from "@/components/search/FlightSearch"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircleQuestion, Plane, BadgeDollarSign } from 'lucide-react'
import { FlightDealCard } from "@/components/FlightDealCard"
import { getFlightDeals, getInfo } from "@/lib/data"
import { useEffect, useState } from "react"

const Flight = ({ infoDataAsString, flightDealsAsString }: { infoDataAsString: string, flightDealsAsString: string }) => {
    const info = JSON.parse(infoDataAsString)
    const flightDeals = JSON.parse(flightDealsAsString)
    return (
        <div className="w-full h-full">
            <div className="w-full h-full pb-40 lg:pb-20">
                <Header title="Search Flights "/>
            </div>
            <div className="flex flex-col bg-gray-50 justify-start  items-center gap-10 w-full h-full pb-20">
                <div className="lg:-mt-36 md:-mt-48 -mt-48 w-full h-full">
                    <div className="w-full h-full px-5">
                        <Card className="w-full max-w-6xl mx-auto">
                            <CardContent className="p-6">
                                <FlightSearch isSearch={false}/>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="w-full h-full px-5">
                    <div className="w-full max-w-6xl mx-auto flex md:flex-row flex-col gap-5 justify-between items-center">
                        <Card className="flex flex-row justify-center items-center w-full gap-5 py-3 px-5">
                            <MessageCircleQuestion className="w-10 h-10 text-second" />
                            <div className="flex flex-col justify-center">
                                <h2 className="text-lg font-semibold">We are Now Available</h2>
                                <p className="text-sm text-muted-foreground">{`Call us on ${info?.phone}`}</p>
                            </div>
                        </Card>
                        <Card className="flex flex-row justify-center items-center w-full gap-5 py-3 px-5">
                            <Plane className="w-10 h-10 text-second" />
                            <div className="flex flex-col justify-center">
                                <h2 className="text-lg font-semibold">International Flights</h2>
                                <p className="text-sm text-muted-foreground">{`Call us on ${info?.phone}`}</p>
                            </div>
                        </Card>
                        <Card className="flex flex-row justify-center items-center w-full gap-5 py-3 px-5">
                            <BadgeDollarSign className="w-10 h-10 text-second" />
                            <div className="flex flex-col justify-center">
                                <h2 className="text-lg font-semibold">Check Refund</h2>
                                <p className="text-sm text-muted-foreground">{`Call us on ${info?.phone}`}</p>
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="w-full h-full mt-10 px-5">
                    <div className="w-full h-full max-w-6xl flex flex-col gap-5 mx-auto">
                        <h1 className="text-3xl font-semibold text-Left">Latest Flight Deals</h1>
                        <div className="w-full h-full flex flex-row flex-wrap justify-center items-center gap-5">
                            {flightDeals && flightDeals?.map((deal: any, index: number) => (
                                <FlightDealCard 
                                    key={index}
                                    image={deal?.image}
                                    title={`${deal?.origin} → ${deal?.destination}`}
                                    date={deal?.date}
                                    price={deal?.price}
                                    flightClass={deal?.class}
                                    link={deal?.link}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Flight