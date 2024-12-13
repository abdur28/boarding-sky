import { Plane, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 flex flex-col gap-5">
        <div className="flex items-center justify-center gap-4">
          <Plane className="h-12 w-12 text-blue-500 rotate-45" />
          <div className="h-12 w-[2px] bg-blue-200" />
          <div className="text-4xl font-bold text-gray-900">404</div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Page Not Found
          </h1>
          <p className="text-gray-500">
            {`Looks like this destination doesn't exist. Let's get you back on track.`}
          </p>
        </div>

        <Link href="/">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}