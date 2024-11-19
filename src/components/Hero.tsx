import Image from "next/image";
import Button from "./Button";
import Link from "next/link";

const Hero = () => {
    return (
        <div className="flex flex-col lg:flex-row w-full  h-[calc(100vh-64px)] md:h-[calc(120vh)] lg:h-[calc(100vh-64px)] px-5 md:px-20 ">
            <div className="flex flex-col gap-5 w-full h-1/2 lg:w-1/2 lg:h-full justify-center  lg:text-left text-center items-center md:px-20 lg:pr-0">
                <h1 className="text-5xl font-semibold">
                Your Journey Begins Above the Clouds
                </h1>
                <p className="text-black/70">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos, perspiciatis.</p>
                <div className="flex w-full justify-center lg:justify-start gap-5">
                    <Link href="/flight">
                        <Button name="Book Now"/>
                    </Link>
                </div>
            </div>
            <div className="flex w-full h-1/2 lg:w-1/2 lg:h-full justify-center items-center lg:-mt-0 -mt-16 p-5">
                <Image 
                src={"/hero.png"}
                alt="hero"
                width={500}
                height={500}
                className="w-full md:w-1/2 md:h-1/2 lg:w-full lg:h-full h-full object-cover overflow-visible"
                />
            </div>
        </div>
    );
}

export default Hero