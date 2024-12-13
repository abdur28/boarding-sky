import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export const revalidate = 0;
export const dynamic = 'force-dynamic'
export const POST = async (req: Request) => {
    noStore();
    const { token, hotelsId, checkIn, checkOut, adults, rooms, priceRange, paymentPolicy, boardType } = await req.json();
    // console.log(token, hotelsId, checkIn, checkOut, adults, rooms);
    try {
        const response = await fetch(`https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelsId}&adults=1&checkInDate=${checkIn}&checkOutDate=${checkOut}&roomQuantity=${rooms}&adults=${adults}&currency=USD&paymentPolicy=${paymentPolicy ? paymentPolicy : 'NONE'}${boardType ? `&boardType=${boardType}` : ''}${priceRange ? `&priceRange=${priceRange}` : ''}&bestRateOnly=true`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
        const data = await response.json();
        // console.log(data);
        return NextResponse.json({ data });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false });
    }
}