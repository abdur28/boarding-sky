import Header from "@/components/Header"
import ToursList from "@/components/pages/TourList";
import { getTours } from "@/lib/data";



const TourPage = async () => {
    const tours = await getTours();
    return (
        <div className="w-full h-full">
            <Header title="Featured Tours"/>
            <div className="w-full h-full flex flex-col justify-center items-center gap-10">
                <div className="w-full h-full flex flex-col justify-center items-center gap-6">
                    <p className="text-center text-2xl md:test-3xl font-semibold ">Discover the best tours and travel experiences from around the world</p>
                </div>
                
                <div className="w-full h-full flex justify-center items-center">
                    <ToursList toursAsString={JSON.stringify(tours)} />
                </div>
                
            </div>
        </div>
    )
}

export default TourPage