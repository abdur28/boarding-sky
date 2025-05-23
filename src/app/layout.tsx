import type { Metadata } from "next";
import "./globals.css";
import FooterSection from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full h-full min-h-screen flex flex-col justify-between bg-fourth">
        <Navbar/>
        <div className="w-full min-h-screen">
        {children}
        </div>
        <FooterSection/>
      </body>
    </html>
  );
}
