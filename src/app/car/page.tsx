import Header from "@/components/Header"
import CarSearch from "@/components/search/CarSearch"
import { Card, CardContent } from "@/components/ui/card"

const CarPage = () => {
    return (
        <div className="w-full h-full">
            <Header title="Search Cars"/>
            <div className="w-full h-full flex flex-col justify-center items-center gap-10">
                <div className="w-full h-full">
                    <div className="w-full h-full px-5">
                        <Card className="w-full max-w-6xl mx-auto">
                            <CardContent className="p-6">
                                <CarSearch />
                            </CardContent>
                        </Card>
                    </div>
                </div>          
            </div>
        </div>
    )
}

export default CarPage