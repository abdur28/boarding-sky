import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export const revalidate = 0;
export const dynamic = 'force-dynamic'
export const POST = async (req: Request) => {
    noStore();
    const client_id = process.env.AMADEUS_CLIENT_ID;
    const client_secret = process.env.AMADEUS_CLIENT_SECRET;
    
    try {
        const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`
        })
        const data = await response.json();
        return NextResponse.json({ data });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false });
    }
}