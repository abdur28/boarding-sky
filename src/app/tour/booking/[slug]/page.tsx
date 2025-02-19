import { getTour } from "@/lib/data";
import Header from "@/components/Header";
import TourBookingPage from "@/components/pages/TourBookingPage";
import { notFound } from "next/navigation";

export default async function BookingPage({ 
  params,
}: { 
  params: any,
}) {
  const { slug } = await params;  
  const tour = await getTour(slug);

  if (!tour) {
    return notFound();
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Header title="Tour Booking" />
      <TourBookingPage 
        tourAsString={JSON.stringify(tour)}
      />
    </div>
  )
}