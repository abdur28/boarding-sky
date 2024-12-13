import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-full min-h-screen h-full flex items-center justify-center">
      <SignUp />
    </div>
    );
}