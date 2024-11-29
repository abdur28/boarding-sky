import Header from "@/components/Header"
import { FlightSearch } from "@/components/search/FlightSearch"
import { Card } from "@/components/ui/card"

const Flight = () => {
    return (
        <div className="w-full h-full">
            <Header title="Search Flights"/>
            <div className="w-full h-full flex flex-col justify-center items-center gap-10">
                <div className="w-full h-full">
                    <FlightSearch />
                </div>
                <div className="w-full h-full flex flex-col max-w-7xl lg:flex-row gap-10 lg:gap-5 justify-center items-center px-5">
                    <div className="w-full h-full lg:w-1/4 ">
                        <Card className="w-full h-screen bg-white flex flex-col">
                            
                        </Card>
                    </div>
                    <div className="w-full h-screen lg:w-3/4 bg-white">

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Flight