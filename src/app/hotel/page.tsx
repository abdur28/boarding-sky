import HotelPage from "@/components/pages/HotelPage";
import { getDestinations, getInfo } from "@/lib/data";

const Hotel = async () => {
    const infoData = await getInfo()
    const destinations = await getDestinations();

    return (
        <HotelPage infoDataAsString={JSON.stringify(infoData)} destinationsAsString={JSON.stringify(destinations)} />
    )
}

export default Hotel