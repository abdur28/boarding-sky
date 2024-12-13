import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export const revalidate = 0;
export const dynamic = 'force-dynamic'
export const POST = async (req: Request) => {
    noStore();
    const { token, hotelsId } = await req.json();
    // console.log(token, hotelsId);
    const url = `https://test.api.amadeus.com/v2/e-reputation/hotel-sentiments?hotelIds=${hotelsId}`
    console.log(url);
    try {
        const response = await fetch(`https://test.api.amadeus.com/v2/e-reputation/hotel-sentiments?hotelIds=${hotelsId}`, {
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