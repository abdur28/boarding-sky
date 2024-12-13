import Header from "@/components/Header"
import FlightSearch from "@/components/search/FlightSearch"
import { Card, CardContent } from "@/components/ui/card"

const Flight = () => {
    return (
        <div className="w-full h-full">
            <Header title="Search Flights"/>
            <div className="w-full h-full flex flex-col justify-center items-center gap-10">
                <div className="w-full h-full">
                    <div className="w-full h-full px-5">
                        <Card className="w-full max-w-6xl mx-auto">
                            <CardContent className="p-6">
                                <FlightSearch isSearch={false}/>
                            </CardContent> 
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Flight