import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export const revalidate = 0;
export const dynamic = 'force-dynamic'
export const POST = async (req: Request) => {
    noStore();
    const { token, city, amenities, ratings } = await req.json();

    try {
        const response = await fetch(`https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${city}&radius=5&radiusUnit=KM${ amenities ? `&amenities=${amenities}` : ''}${ ratings  ? `&ratings=${ratings}` : ''}&hotelSource=ALL`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
        const data = await response.json();
        const hotelsId = data.data.slice(0, 50).map((hotel: any) => hotel.hotelId);
        return NextResponse.json({ hotelsId });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false });
    }
}