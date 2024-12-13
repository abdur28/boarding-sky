"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { UserRound, CalendarCheck } from "lucide-react";
import { CldImage } from "next-cloudinary";


export function BlogCard({
  images,
  title,
  subTitle,
  author,
  publishDate,
  _id,
}:{
  images: any;
  title: string;
  subTitle: string;
  author: string;
  publishDate: string;
  _id: any;
}) {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-white relative group/card border-black/[0.1] w-[calc(100vw-2rem)] sm:w-[23rem] h-auto rounded-xl p-6 border">
       
        <CardItem translateZ="100" className="w-full">
          {images && images?.length > 0 ? (
            <CldImage
            src={images[0]}
            height="1000"
            width="1000"
            alt={title}
            className="h-60 w-full object-cover rounded-xl  group-hover/card:shadow-xl"
          />
          ): (
            <Image
            src={'/placeholder-image.png'}
            height="1000"
            width="1000"
            alt={title}
            className="h-60 w-full object-cover rounded-xl  group-hover/card:shadow-xl"
          />
          )}
        </CardItem>
        <CardItem
          as="div"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 flex flex-row dark:text-neutral-300"
        >
          <UserRound className="w-5 h-5 text-muted-foreground" />
          <span className="ml-2">{author}</span>
          <span className="ml-2">|</span>
          <CalendarCheck className="w-5 h-5 ml-2 text-muted-foreground" />
          <span className="ml-2">{publishDate}</span>
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
          {subTitle}
        </CardItem>
        <Link
        href={`/blog/${_id}`}
        className="flex justify-end items-center mt-5">
          <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-lg bg-first hover:bg-second text-white text-xs font-bold"
          >
            Read More
          </CardItem>
        </Link>
      </CardBody>
    </CardContainer>
  );
}
