import type { Metadata } from "next";
import "./globals.css";
import FooterSection from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { initializeApp } from "@/lib/init";

export const metadata: Metadata = {
  title: "Boarding Sky",
  description: "Book your next flight with ease and convenience",
};


// Initialize the app
initializeApp();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="w-full h-full min-h-screen flex flex-col justify-between bg-fourth">
          <Navbar/>
          <div className="w-full min-h-screen">
          {children}
          </div>
          <FooterSection/>
        </body>
      </html>
    </ClerkProvider>
  );
}
