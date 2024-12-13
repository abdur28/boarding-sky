import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Car, Building, CalendarDays, MessageCircleQuestion, UserRound, UserRoundCheck } from 'lucide-react'
import { Reviews } from "@/components/Reviews";
import { getInfo } from "@/lib/data";
import GoalsCard from "@/components/GoalsCard";
import CustomImage from "@/components/CustomImage";

export default async function About() {
    const info = await getInfo();
    return (
        <div className="w-full h-full bg-fourth px-5 pb-10">
            <Header title="About Us" />
            <div className="w-full max-w-6xl mx-auto">
                <div className="w-full h-full flex flex-col gap-20 justify-center items-center">
                    <Card className="flex lg:flex-row flex-col  justify-center items-center w-full gap-10 py-10 px-5 lg:px-10">
                        <div className="w-full lg:w-1/2 h-full flex flex-col gap-5 justify-center items-center text-center lg:text-left">
                            <h1 className="text-3xl font-semibold">{info?.aboutText}</h1>
                            <p className="">{info?.aboutDescription}</p>
                        </div>
                        <div className="w-full lg:w-1/2 h-full flex justify-center items-center">
                            <CustomImage
                            src={info?.aboutImage}
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
                                <h1 className="text-3xl font-semibold">{info?.historyText}</h1>
                                <h3 className="text-xl text-second">{info?.historySubText}</h3>
                                <p>{info?.historyDescription}</p>
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
                                {info?.historyImages.map((image: string, index: number) => (
                                <div key={index} className="w-full md:w-[45%] h-[250px] md:h-[200px]">
                                    <CustomImage
                                    src={image}
                                    alt={`image ${index}`}  
                                    width={500}
                                    height={500}
                                    className="w-full h-full rounded-xl object-cover"
                                    />
                                </div>
                                ))}
                            </div>
                         </div>
                    </div>
                    <Card className="flex flex-col lg:flex-row justify-center items-center w-full gap-5 p-5 md:p-10">
                        <div className="flex-col lg:w-2/5 w-full flex justify-center h-full">
                            <p className="text-lg text-third">Reviews</p>
                            <h3 className="text-2xl font-semibold">What Our Clients Say?</h3>
                        </div>
                        <div className="w-full lg:w-3/5 h-full flex justify-center items-center">
                            <Reviews reviews={info?.reviews}/>
                        </div>
                    </Card>
                    <GoalsCard title={info?.goalsText} description={info?.goalsDescription} image={info?.goalsImage} customers={info?.goalsCustomers} clientSatisfaction={info?.goalsClientSatisfaction} />
                </div>
            </div>    
        </div>
    )
}