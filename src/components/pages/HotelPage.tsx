'use client'

import Header from "@/components/Header"
import HotelSearch from "@/components/search/HotelSearch"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircleQuestion, Building2, BadgeDollarSign } from 'lucide-react'
import { WobbleCards } from "../WobbleCards"

const HotelPage = ({infoDataAsString, destinationsAsString}: {infoDataAsString: string, destinationsAsString: string}) => {
    
    const info = JSON.parse(infoDataAsString)
    const destinations = JSON.parse(destinationsAsString)

    return (
        <div className="w-full h-full">
            <div className="w-full h-full pb-40 lg:pb-20">
                <Header title="Search Hotels"/>
            </div>
            <div className="flex flex-col bg-gray-50 justify-start items-center gap-10 w-full h-full pb-20">
                <div className="lg:-mt-20 md:-mt-20 -mt-40 w-full h-full">
                    <div className="w-full h-full px-5">
                        <Card className="w-full max-w-6xl mx-auto">
                            <CardContent className="p-6">
                                <HotelSearch />
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
                            <Building2 className="w-10 h-10 text-second" />
                            <div className="flex flex-col justify-center">
                                <h2 className="text-lg font-semibold">Luxury Hotels</h2>
                                <p className="text-sm text-muted-foreground">{`Call us on ${info?.phone}`}</p>
                            </div>
                        </Card>
                        <Card className="flex flex-row justify-center items-center w-full gap-5 py-3 px-5">
                            <BadgeDollarSign className="w-10 h-10 text-second" />
                            <div className="flex flex-col justify-center">
                                <h2 className="text-lg font-semibold">Best Price</h2>
                                <p className="text-sm text-muted-foreground">{`Call us on ${info?.phone}`}</p>
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="w-full h-full mt-10 px-5">
                    <div className="w-full h-full max-w-6xl flex flex-col gap-5 mx-auto">
                        <div className="w-full max-w-6xl mx-auto flex flex-col gap-5 ">
                            <h1 className="text-3xl font-semibold text-Left mt-20">Explore Popular Destinations</h1>
                            <WobbleCards destinationsAsString={JSON.stringify(destinations)}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HotelPage