import Link from 'next/link';
import Header from '@/components/Header';
import { CheckCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';


const SuccessPage = async ({searchParams}: {searchParams: any}) => {
    const {session_id } = await searchParams
    if (!session_id) notFound();
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header title="Booking Confirmation" />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Thank you for your booking!</h1>
          <p className="text-xl mb-8">
            Your booking has been successfully processed. We are thrilled to have you on board!
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">What's Next?</h2>
            <ul className="text-left list-disc pl-6 mb-6">
              <li>Check your email for the booking confirmation and details.</li>
              <li>Start planning your amazing travel adventure!</li>
              <li>If you have any questions, feel free to reach out to our support team.</li>
            </ul>
          </div>
          <div className="flex justify-center space-x-4">
            <Link href="/">
                <Button variant="default">Back to Home</Button>
            </Link>
            <Link href="/dashboard">
                <Button variant="default">View Bookings</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuccessPage;