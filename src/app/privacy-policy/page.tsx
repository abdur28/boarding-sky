import Header from "@/components/Header";
import { fetchPrivacyPolicy } from "@/lib/action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Our privacy policy and data protection guidelines',
};

export default async function PrivacyPolicy() {
  const policy = await fetchPrivacyPolicy();

  return (
    <div className="w-full h-full bg-fourth pb-10">
      <Header title="Privacy Policy" />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <article 
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: policy }}
          />
        </div>
      </main>
    </div>
  );
}