import { BookingContainer } from "@/components/booking-container";
import Button from "@/components/Button";
import Hero from "@/components/Hero";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Plane, MessageCircleQuestion, BadgeDollarSign, UserRound, UserRoundCheck} from 'lucide-react'
import { FlightDealCard } from "@/components/FlightDealCard";
import { GlobeSection } from "@/components/GlobeSection";
import { WobbleCards } from "@/components/WobbleCards";
import Link from "next/link";
import { BlogCard } from "@/components/BlogCard";
import { Reviews } from "@/components/Reviews";


export default function Home() {
  return (
    <>
      <div className="w-full h-[calc(100vh-64px)] md:h-[calc(120vh)] lg:h-[calc(120vh)] bg-fourth">
        <Hero />
      </div>
      <div className="w-full lg:h-0 md:h-44 h-64 bg-fourth"></div>
      <div className="flex flex-col bg-gray-50 justify-start items-center gap-10 w-full h-full pb-20">
        <div className="lg:-mt-36 md:-mt-48 -mt-72 w-full h-full">
          <BookingContainer />
        </div>
        <div className="w-full h-full px-5">
          <div className="w-full max-w-6xl mx-auto flex md:flex-row flex-col gap-5 justify-between items-center">
            <Card className="flex flex-row justify-center items-center w-full  gap-5 py-3 px-5">
              <MessageCircleQuestion className="w-10 h-10 text-second" />
              <div className="flex flex-col justify-center">
                <h2 className="text-lg font-semibold">We are Now Available</h2>
                <p className="text-sm text-muted-foreground">Call us on +1 234 567 890</p>
              </div>
            </Card>
            <Card className="flex flex-row justify-center items-center w-full  gap-5 py-3 px-5">
              <Plane className="w-10 h-10 text-second" />
              <div className="flex flex-col  justify-center">
                <h2 className="text-lg font-semibold">International Flights</h2>
                <p className="text-sm text-muted-foreground">Call us on +1 234 567 890</p>
              </div>
            </Card>
            <Card className="flex flex-row justify-center items-center w-full gap-5 py-3 px-5">
              <BadgeDollarSign className="w-10 h-10 text-second" />
              <div className="flex flex-col justify-center">
                <h2 className="text-lg font-semibold">Check Refund</h2>
                <p className="text-sm text-muted-foreground">Call us on +1 234 567 890</p>
              </div>
            </Card>
          </div>
        </div>
        <div className="w-full h-full mt-10 px-5">
          <div className="w-full h-full max-w-6xl flex flex-col gap-5 mx-auto">
            <h1 className="text-3xl font-semibold text-Left">Latest Flight Deals</h1>
            <div className="w-full h-full flex flex-row flex-wrap justify-center  items-center gap-5">
              <FlightDealCard 
              image="https://images.unsplash.com/photo-1726108954014-71ffe50f8a26?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              title="Moscow to Dubai"
              date="Dec 12, 2024 - Dec 15, 2024"
              price="980"
              flightClass="Business"
              link="/"
              />
              <FlightDealCard 
              image="https://images.unsplash.com/photo-1704580615544-ffb922e61f27?q=80&w=1518&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              title="Moscow to Australia"
              date="Dec 12, 2024 - Dec 15, 2024"
              price="670"
              flightClass="Business"
              link="/"
              />
              <FlightDealCard 
              image="https://images.unsplash.com/photo-1731600512388-aec36dce82b6?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              title="Moscow to Switzerland"
              date="Dec 12, 2024 - Dec 15, 2024"
              price="510"
              flightClass="Economy"
              link="/"
              />
            </div>
          </div>  
        </div>
      </div>
      <div className="w-full h-full">
        <GlobeSection />
      </div>
      <div className="w-full h-full bg-fourth px-5">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-5 ">
          <h1 className="text-3xl font-semibold text-Left mt-20">Explore Popular Destinations</h1>
          <WobbleCards />
        </div>
      </div>
      <div className="w-full h-full bg-fourth px-5 py-20">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-10 justify-center items-center">
          <Card className="flex flex-col lg:flex-row justify-center w-full gap-5 p-5 md:p-10">
              <div className="flex flex-col justify-center w-full gap-5">
                <p className="text-third text-lg">Goals</p>
                <h3 className="text-2xl font-semibold">Your Next Destination Awaits You</h3>
                <p className="text-lg text-muted-foreground">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore reprehenderit, consequatur natus voluptatum quas officiis </p>
                <div className="flex flex-col md:flex-row w-full justify-center items-center gap-5">
                  <Card className="bg-muted flex flex-row justify-between items-center w-full py-3 px-5">
                      <div className="flex flex-col">
                          <p className="text-2xl text-third font-semibold">987655 +</p> 
                          <p className="text-lg">Happy Customers</p>
                      </div>
                      <UserRound className="w-10 h-10 text-third" />
                  </Card>
                  <Card className="bg-muted flex flex-row justify-between items-center w-full py-3 px-5">
                      <div className="flex flex-col">
                          <p className="text-2xl text-third font-semibold">100%</p> 
                          <p className="text-lg">Client Satisfied</p>
                      </div>
                      <UserRoundCheck className="w-10 h-10 text-third" />
                  </Card>
                </div>
                <div className="flex flex-col md:flex-row w-full   gap-5">
                  <p className="text-lg ">Connect with Us for More Information</p>
                  <Link href="/contact">
                    <Button name="Contact Us" />
                  </Link>
                </div>
              </div>
              <div className="w-full  md:h-80 h-56 overflow-hidden rounded-lg flex items-center justify-center">
                <Image src="/person-in-plane.jpg" alt="contact" width={1000} height={1000} className="object-cover" />
              </div>
          </Card>
          <Card className="flex flex-col lg:flex-row justify-center items-center w-full gap-5 p-5 md:p-10">
              <div className="flex-col lg:w-2/5 w-full flex justify-center h-full">
                  <p className="text-lg text-third">Reviews</p>
                  <h3 className="text-2xl font-semibold">What Our Clients Say?</h3>
              </div>
              <div className="w-full lg:w-3/5 h-full flex justify-center items-center">
                  <Reviews />
              </div>
          </Card>

        </div>
      </div>
      <div className="w-full h-full my-10 px-5">
          <div className="w-full h-full max-w-6xl flex flex-col gap-5 mx-auto">
            <div className="flex flex-row justify-between items-center w-full">
              <h1 className="text-3xl font-semibold text-Left">Latest Blogs</h1>
              <Link href="/blog" >
                <Button name="View All" />
              </Link>
            </div>
            <div className="w-full h-full flex flex-row flex-wrap justify-center  items-center gap-5">
              <BlogCard 
                author="John Doe" 
                date="Dec 12, 2024" 
                link="/"
                title="Lorem ipsum dolor sit amet consectetur adipisicing elit." 
                discription="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, perspiciatis." 
                image="https://images.unsplash.com/photo-1731069945702-53e476208ad8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
 
              <BlogCard 
                author="Jane Doe" 
                date="Dec 6, 2024" 
                link="/"
                title="Lorem ipsum dolor sit amet consectetur adipisicing elit." 
                discription="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, perspiciatis." 
                image="https://images.unsplash.com/photo-1727640851526-9dd11cc6bd07?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
     
              <BlogCard 
                author="John Doe" 
                date="Nov 12, 2024" 
                link="/"
                title="Lorem ipsum dolor sit amet consectetur adipisicing elit." 
                discription="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, perspiciatis." 
                image="https://images.unsplash.com/photo-1731512883997-bbd3d801e1a9?q=80&w=1533&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />


            </div>
          </div>  
        </div>
    </>     
  );
}
