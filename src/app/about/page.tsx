import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Car, Building, CalendarDays, MessageCircleQuestion, UserRound, UserRoundCheck } from 'lucide-react'
import Link from "next/link";
import Button from "@/components/Button";
import { Reviews } from "@/components/Reviews";

export default function About() {
    return (
        <div className="w-full h-full bg-fourth px-5 pb-10">
            <Header title="About Us" />
            <div className="w-full max-w-6xl mx-auto">
                <div className="w-full h-full flex flex-col gap-20 justify-center items-center">
                    <Card className="flex lg:flex-row flex-col  justify-center items-center w-full gap-10 py-10 px-5 lg:px-10">
                        <div className="w-full lg:w-1/2 h-full flex flex-col gap-5 justify-center items-center text-center lg:text-left">
                            <h1 className="text-3xl font-semibold">Where Your Journey Begins with Quality and Reliability</h1>
                            <p className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, perspiciatis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis, laudantium amet. Exercitationem a asperiores maiores ducimus quibusdam expedita accusamus totam non, dicta fugiat placeat debitis laborum explicabo impedit mollitia necessitatibus. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure laboriosam quo quaerat error culpa inventore enim ipsam odit illo tempora perspiciatis quisquam recusandae dolor vitae, magnam ad dolore, expedita fuga!</p>
                        </div>
                        <div className="w-full lg:w-1/2 h-full flex justify-center items-center">
                            <Image 
                            src={"https://images.unsplash.com/photo-1515164771271-b7e3d74dd484?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                            alt="about"
                            width={500}
                            height={500}
                            className="w-[30rem] rounded-xl object-cover"
                            />
                        </div>
                    </Card>
                    <div className="w-full h-full flex flex-col lg:flex-row justify-center gap-10 items-center">
                         <div className="w-full lg:w-1/2 h-full flex flex-col gap-5 justify-center items-center">
                            <div className="w-full h-full flex flex-col gap-2 justify-center px-5">
                                <h1 className="text-3xl font-semibold">Our History</h1>
                                <h3 className="text-xl text-second">Since 2000</h3>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque nulla quos architecto voluptatem soluta obcaecati consequatur, quibusdam incidunt iusto, ad culpa nam ratione accusamus et ullam! Quae soluta vitae consequuntur!</p>
                            </div>
                            <div className="w-full h-full flex flex-col md:flex-row md:flex-wrap gap-5 justify-center items-center">
                                <Card className="w-full md:w-[45%] flex flex-row justify-between items-center p-5 lg:p-2 gap-5 ">
                                    <CalendarDays className="w-10 h-10 text-second" />
                                    <p className="w-full flex justify-center items-start">Seamless Booking Experience</p>
                                </Card>
                                <Card className="w-full md:w-[45%] flex flex-row justify-between items-center p-5 lg:p-2 gap-5 ">
                                    <Building className="w-10 h-10 text-second" />
                                    <p className="w-full flex justify-center items-start">Luxury Hotels, Meticulously Maintained</p>
                                </Card>
                                <Card className="w-full md:w-[45%] flex flex-row justify-between items-center p-5 lg:p-2 gap-5  ">
                                    <Car className="w-10 h-10 text-second" />
                                    <p className="w-full flex justify-center items-start">Wide Range of Premium Vehicles</p>
                                </Card>
                                <Card className="w-full md:w-[45%] flex flex-row justify-between items-center p-5 lg:p-2 gap-5 ">
                                    <MessageCircleQuestion className="w-10 h-10 text-second" />
                                    <p className="w-full flex justify-center items-start">Exceptional Customer Service</p>
                                </Card>
                            </div>
                         </div>
                         <div className="w-full lg:w-1/2 h-full flex justify-center items-center">
                            <div className="w-full h-full flex flex-col md:flex-row md:flex-wrap gap-5 justify-center items-center">
                                <div className="w-full md:w-[45%] h-[250px] md:h-[200px]">
                                    <Image
                                    src={"https://images.unsplash.com/photo-1718604252329-432f8c50e349?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                                    alt="image1"
                                    width={500}
                                    height={500}
                                    className="w-full h-full rounded-xl object-cover"
                                    />
                                </div>
                                <div className="w-full md:w-[45%] h-[250px] md:h-[200px]">
                                    <Image
                                    src={"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                                    alt="image1"
                                    width={500}
                                    height={500}
                                    className="w-full h-full rounded-xl object-cover"
                                    />
                                </div>
                                <div className="w-full md:w-[45%] h-[250px] md:h-[200px]">
                                    <Image
                                    src={"https://images.unsplash.com/photo-1650803878810-1e4eaffc8466?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                                    alt="image1"
                                    width={500}
                                    height={500}
                                    className="w-full h-full rounded-xl object-cover "
                                    />
                                </div>
                                <div className="w-full md:w-[45%] h-[250px] md:h-[200px]">
                                    <Image
                                    src={"https://images.unsplash.com/photo-1709715357564-ab64e091ead9?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                                    alt="image1"
                                    width={500}
                                    height={500}
                                    className="w-full h-full rounded-xl object-cover"
                                    />
                                </div>
                            </div>
                         </div>
                    </div>
                    <Card className="flex flex-col lg:flex-row justify-center items-center w-full gap-5 p-5 md:p-10">
                        <div className="flex-col lg:w-2/5 w-full flex justify-center h-full">
                            <p className="text-lg text-third">Reviews</p>
                            <h3 className="text-2xl font-semibold">What Our Clients Say?</h3>
                        </div>
                        <div className="w-full lg:w-3/5 h-full flex justify-center items-center">
                            <Reviews />
                        </div>
                    </Card>
                    <Card className="flex flex-col lg:flex-row justify-center items-center w-full gap-5 p-5 md:p-10">
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
                        <div className="w-full md:w-[30rem] lg:w-full md:h-80 h-56 overflow-hidden rounded-lg flex items-center justify-center">
                            <Image src="/person-in-plane.jpg" alt="contact" width={1000} height={1000} className="object-cover" />
                        </div>
                    </Card>
                </div>
            </div>    
        </div>
    )
}