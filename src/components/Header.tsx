import Image from "next/image"

const Header = ({title}:{title:string}) => {
    return (
        <div className="bg-fourth w-full h-[calc(30vh)] flex justify-center items-center">
            <div className="w-full h-full flex flex-col justify-center items-center px-10">
                <h1 className="text-4xl font-semibold">{title}</h1>
                <Image src={"/airplane-route.png"} alt="airplane" width={500} height={500} className=" md:-mt-10 -mt-5" />
            </div>
        </div>
    )   
}

export default Header