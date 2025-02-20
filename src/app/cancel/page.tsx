import Link from 'next/link';
import Header from '@/components/Header';
import { IconExclamationCircleFilled } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

const CancelPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header title="Booking Cancellation" />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <IconExclamationCircleFilled className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Booking Cancellation</h1>
          <p className="text-xl mb-8">
           {`We're sorry to hear that you had to cancel your booking. If there's anything we can do to assist you further, please let us know.`}
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">{`What Now?`}</h2>
            <ul className="text-left list-disc pl-6 mb-6">
              <li>{`If you cancelled within the allowed cancellation period, you should receive a refund according to our cancellation policy.`}</li>
              <li>{`Please check your email for a confirmation of the cancellation and any relevant details.`}</li>
              <li>{`If you have any questions or concerns, our support team is here to help.`}</li>
            </ul>
          </div>
          <div className="flex justify-center space-x-4">
            <Link href="/">
                <Button variant="default">Back to Home</Button>
            </Link>
            <Link href="/contact">
                <Button variant="default">Contact Support</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CancelPage;