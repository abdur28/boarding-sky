'use client'

import { UserRound, UserRoundCheck } from "lucide-react"
import { Card } from "./ui/card"
import Link from "next/link"
import Button from "./Button"
import { CldImage } from "next-cloudinary"
import NumberTicker from './ui/number-ticker';

const GoalsCard = ({title, description, image, customers, clientSatisfaction}: {title: string, description: string, image: string, customers: string, clientSatisfaction: string}) => {
    return (
    <Card className="flex flex-col lg:flex-row justify-center w-full gap-5 p-5 md:p-10">
        <div className="flex flex-col justify-center w-full gap-5">
          <p className="text-third text-lg">Goals</p>
          <h3 className="text-2xl font-semibold">{title}</h3>
          <p className="text-lg text-muted-foreground">{description}</p>
          <div className="flex flex-col md:flex-row w-full justify-center items-center gap-5">
            <Card className="bg-muted flex flex-row justify-between items-center w-full py-3 px-5">
                <div className="flex flex-col">
                    <p className="text-2xl text-third font-semibold"><NumberTicker className="text-third" value={parseInt(customers)} /> +</p> 
                    <p className="text-lg">Happy Customers</p>
                </div>
                <UserRound className="w-10 h-10 text-third" />
            </Card>
            <Card className="bg-muted flex flex-row justify-between items-center w-full py-3 px-5">
                <div className="flex flex-col">
                    <p className="text-2xl text-third font-semibold"><NumberTicker className="text-third" value={parseInt(clientSatisfaction)} />%</p> 
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
          <CldImage src={image} alt="contact" width={1000} height={1000} className="object-cover" />
        </div>
    </Card>
    )
}

export default GoalsCard
        