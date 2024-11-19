"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import Link from "next/link";

export function FlightDealCard({
  image,
  title,
  date,
  flightClass,
  price,
  link,
}: {
  image: string;
  title: string;
  date: string;
  flightClass: string;
  price: string;
  link: string;
}) {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-white relative group/card border-black/[0.1] w-[calc(100vw-2rem)] sm:w-[23rem] h-auto rounded-xl p-6 border">
       
        <CardItem translateZ="100" className="w-full">
          <Image
            src={image}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl  group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white mt-4"
        >
          {title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          {date}
        </CardItem>
        <div className="flex justify-between items-center mt-10">
          <div className="flex flex-col">
            <CardItem
                translateZ={20}
                className="rounded-xl text-xs font-normal dark:text-white"
            >
                {flightClass}
            </CardItem>
            <CardItem
                translateZ={20}
                className=" rounded-xl  font-normal dark:text-white"
            >
                ${price}
            </CardItem>
          </div>
          <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-lg bg-first hover:bg-second text-white text-xs font-bold"
          >
            Book Now
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
