import Header from "@/components/Header";
import ReceiptDetailsPage from "@/components/pages/ReceiptDetailsPage";

const ReceiptPage = async ({ params }: { params: any }) => {
    const { slug } = await params;
    return (
        <div className="w-full h-full flex flex-col gap-6">
            <Header title="Receipt Details" />
            <ReceiptDetailsPage id={slug} />
        </div>
    );
};

export default ReceiptPage;