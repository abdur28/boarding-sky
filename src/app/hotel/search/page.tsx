import Header from "@/components/Header";
import HotelSearchPage from "@/components/pages/HotelSearchPage";

const FlightOffers = async ({ searchParams }: { searchParams: any }) => {
    const params = await searchParams;
    // console.log(params);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <Header title="Search Hotels"/>
            <HotelSearchPage {...params} />
        </div>
    )
}

export default FlightOffers

