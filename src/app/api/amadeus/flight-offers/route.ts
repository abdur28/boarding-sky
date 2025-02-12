import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export const revalidate = 0;
export const dynamic = 'force-dynamic'
export const POST = async (req: Request) => {
    noStore();
    const { token, origin, destination, adults, travelClass, departureDate, returnDate, children, infants } = await req.json();

    try {
        const response = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&travelClass=${travelClass}&departureDate=${departureDate}${returnDate  ? `&returnDate=${returnDate}`: ``}&adults=${adults}${children > 0 ? `&children=${children}`: ``}${infants > 0 ? `&infants=${infants}`: ``}&currencyCode=USD&nonStop=false&max=100`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
        const data = await response.json();
        return NextResponse.json({ data });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false });
    }
}