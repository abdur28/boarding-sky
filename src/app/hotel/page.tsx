import Header from "@/components/Header"
import HotelSearch from "@/components/search/HotelSearch"
import { Card, CardContent } from "@/components/ui/card"

const HotelPage = () => {
    return (
        <div className="w-full h-full">
            <Header title="Search Hotels"/>
            <div className="w-full h-full flex flex-col justify-center items-center gap-10">
                <div className="w-full h-full">
                    <div className="w-full h-full px-5">
                        <Card className="w-full max-w-6xl mx-auto">
                            <CardContent className="p-6">
                                <HotelSearch />
                            </CardContent> 
                        </Card>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default HotelPage