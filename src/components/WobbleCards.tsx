"use client";
import Image from "next/image";
import React from "react";
import { WobbleCard } from "./ui/wobble-card";

export function WobbleCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full  min-h-[300px] lg:min-h-[300px]"
        className=""
        backgroundImage="https://images.unsplash.com/photo-1731410612760-4d9ae680d5e9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      >
        <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Italy
          </h2>
          <p className="mt-4 text-left  text-base/6 text-neutral-200">
            Italy is a country vased with spectacular landscapes and a rich history.
            It is the land of culture and history.
          </p>
        </div>
      </WobbleCard>
      <WobbleCard 
      backgroundImage="https://images.unsplash.com/photo-1704740413900-580c5c494711?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      containerClassName="col-span-1 min-h-[300px]">
        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          Japan
        </h2>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
          Japan, officially the Empire of Japan, is a sovereign island country in East Asia.
          It is rich with great natural beauty.
        </p>
      </WobbleCard>
      <WobbleCard 
      backgroundImage="https://images.unsplash.com/photo-1727163941315-1cc29bb49e54?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[300px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Singapore 
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
            Singapore, officially the Republic of Singapore, is a sovereign island country in Southeast Asia.
            It is rich with great natural beauty.
          </p>
        </div>
      </WobbleCard>
    </div>
  );
}
