import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { count } from "console";

export const revalidate = 0;
export const dynamic = 'force-dynamic'
export const POST = async (req: Request) => {
    noStore();
    const { query } = await req.json();
    try {
        const response = await fetch(`https://autocomplete.travelpayouts.com/places2?locale=en&types[]=airport&types[]=city,country,airport&term=${query}`, {
            method: "GET",
        })
        const data = await response.json();
        if (data === undefined) {
            return NextResponse.json({ success: false });
        }
        const filteredAirports = data.map((airport: any) => ({
            name: airport.name,
            iataCode: airport.code,
            countryCode: airport.country_code,
            cityName: airport.city_name,
            cityCode: airport.city_code,
        }))
        return NextResponse.json({ data: filteredAirports });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false });
    }
}