import FlightPage from "@/components/pages/FlightPage"
import { getFlightDeals, getInfo } from "@/lib/data"

const Flight = async () => {
    const info = await getInfo()
    const dealsData = await getFlightDeals()
    return (
        <FlightPage infoDataAsString={JSON.stringify(info)} flightDealsAsString={JSON.stringify(dealsData)} />
    )
}

export default Flight