// app/terms-and-conditions/page.tsx
import Header from "@/components/Header";
import { fetchTermsAndConditions } from "@/lib/action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Our terms of service and conditions of use',
};

export default async function TermsAndConditions() {
  const terms = await fetchTermsAndConditions();

  return (
    <div className="w-full h-full bg-fourth pb-10">
      <Header title="Terms and Conditions" />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <article 
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: terms }}
          />
        </div>
      </main>
    </div>
  );
}