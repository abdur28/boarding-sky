import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { count } from "console";

export const revalidate = 0;
export const dynamic = 'force-dynamic'
export const POST = async (req: Request) => {
    noStore();
    const { token, city } = await req.json();
    // console.log(token, city);
    try {
        const response = await fetch(`https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${city}&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score&view=FULL`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
        const data = await response.json();
        // console.log(data);
        if (data.data === undefined) {
            return NextResponse.json({ success: false });
        }
        const filteredAirports = data.data.map((airport: any) => ({
            name: airport.name.replace(/\w\S*/g, (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
            iataCode: airport.iataCode,
            countryCode: airport.address.countryCode,
            cityName: airport.address.cityName.replace(/\w\S*/g, (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
            stateCode: airport.address.stateCode,
        }))
        return NextResponse.json({ data: filteredAirports });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false });
    }
}