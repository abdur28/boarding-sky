import Header from "@/components/Header";
import FlightSearchPage from "@/components/pages/FlightSearchPage";

const FlightOffers = async ({ searchParams }: { searchParams: any }) => {
    const params = await searchParams;

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <Header title="Search Flights"/>
            <FlightSearchPage {...params} />
        </div>
    )
}

export default FlightOffers

