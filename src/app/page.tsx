import { SearchContainer } from "@/components/search/SearchContainer";
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
import { blogs, getBlogs, getDestinations, getFlightDeals, getInfo } from "@/lib/data";
import GoalsCard from "@/components/GoalsCard";


export default async function Home() {
  const info = await getInfo();
  const allBlogs = await getBlogs();
  const flightDeals = await getFlightDeals();
  const destinations = await getDestinations();

  let blogs: any = []
  if (allBlogs && allBlogs?.length > 3) {
    blogs = allBlogs.slice(0, 2)
  } else if (allBlogs && allBlogs?.length <= 3) {
    blogs = allBlogs
  }

  return (
    <>
      <div className="w-full h-[calc(100vh-64px)] md:h-[calc(120vh)] lg:h-[calc(120vh)] bg-fourth">
        <Hero title={info?.heroText} description={info?.heroDescription} image={info?.heroImage} />
      </div>
      <div className="w-full lg:h-0 md:h-44 h-64 bg-fourth"></div>
      <div className="flex flex-col bg-gray-50 justify-start items-center gap-10 w-full h-full pb-20">
        <div className="lg:-mt-36 md:-mt-48 -mt-72 w-full h-full">
          <SearchContainer />
        </div>
        <div className="w-full h-full px-5">
          <div className="w-full max-w-6xl mx-auto flex md:flex-row flex-col gap-5 justify-between items-center">
            <Card className="flex flex-row justify-center items-center w-full  gap-5 py-3 px-5">
              <MessageCircleQuestion className="w-10 h-10 text-second" />
              <div className="flex flex-col justify-center">
                <h2 className="text-lg font-semibold">We are Now Available</h2>
                <p className="text-sm text-muted-foreground">{`Call us on ${info?.phone}`}</p>
              </div>
            </Card>
            <Card className="flex flex-row justify-center items-center w-full  gap-5 py-3 px-5">
              <Plane className="w-10 h-10 text-second" />
              <div className="flex flex-col  justify-center">
                <h2 className="text-lg font-semibold">International Flights</h2>
                <p className="text-sm text-muted-foreground">{`Call us on ${info?.phone}`}</p>
              </div>
            </Card>
            <Card className="flex flex-row justify-center items-center w-full gap-5 py-3 px-5">
              <BadgeDollarSign className="w-10 h-10 text-second" />
              <div className="flex flex-col justify-center">
                <h2 className="text-lg font-semibold">Check Refund</h2>
                <p className="text-sm text-muted-foreground">{`Call us on ${info?.phone}`}</p>
              </div>
            </Card>
          </div>
        </div>
        <div className="w-full h-full mt-10 px-5">
          <div className="w-full h-full max-w-6xl flex flex-col gap-5 mx-auto">
            <h1 className="text-3xl font-semibold text-Left">Latest Flight Deals</h1>
            <div className="w-full h-full flex flex-row flex-wrap justify-center  items-center gap-5">
              {flightDeals && flightDeals?.map((deal: any, index: number) => (
                <FlightDealCard 
                key={index}
                image={deal?.image}
                title={`${deal?.origin} → ${deal?.destination}`}
                date={deal?.date}
                price={deal?.price}
                flightClass={deal?.class}
                link={deal?.link}
                />
              ))}
            </div>
          </div>  
        </div>
      </div>
      {/* <div className="w-full h-full">
        <GlobeSection title={info?.globeText} description={info?.globeDescription} />
      </div> */}
      <div className="w-full h-full bg-fourth px-5">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-5 ">
          <h1 className="text-3xl font-semibold text-Left mt-20">Explore Popular Destinations</h1>
          <WobbleCards destinationsAsString={JSON.stringify(destinations)}/>
        </div>
      </div>
      <div className="w-full h-full bg-fourth px-5 py-20">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-10 justify-center items-center">
          <GoalsCard title={info?.goalsText} description={info?.goalsDescription} image={info?.goalsImage} customers={info?.goalsCustomers} clientSatisfaction={info?.goalsClientSatisfaction} />
          <Card className="flex flex-col lg:flex-row justify-center items-center w-full gap-5 p-5 md:p-10">
              <div className="flex-col lg:w-2/5 w-full flex justify-center h-full">
                  <p className="text-lg text-third">Reviews</p>
                  <h3 className="text-2xl font-semibold">What Our Clients Say?</h3>
              </div>
              <div className="w-full lg:w-3/5 h-full flex justify-center items-center">
                  <Reviews reviews={info?.reviews}/>
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
              {blogs?.length > 0 ?
                blogs?.map((blog: any) => (
                  <BlogCard key={blog._id as string} _id={JSON.stringify(blog._id).split('"')[1]} title={blog.title} subTitle={blog.subTitle} author={blog.author} publishDate={blog.publishDate} images={blog.images} />
              )):(
                <div className="w-full h-full flex flex-col gap-5 justify-center items-center text-center text-muted-foreground">
                  <h1 className="text-3xl font-semibold">No blog found</h1>
                </div>
              )}

            </div>
          </div>  
        </div>
    </>     
  );
}
