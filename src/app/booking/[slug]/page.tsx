import Header from "@/components/Header";
import BookingDetailsPage from "@/components/pages/BookingDetailsPage";

const BookingPage = async ({ params }: { params: any }) => {
    const { slug } = await params;
    return (
        <div className="w-full h-full flex flex-col gap-6">
            <Header title="Booking Details" />
            <BookingDetailsPage id={slug} />
        </div>
    );
}

export default BookingPage