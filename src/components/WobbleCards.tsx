"use client";
import React from "react";
import { WobbleCard } from "./ui/wobble-card";

export function WobbleCards({destinationsAsString}: {destinationsAsString: string}) {

  const destinations = JSON.parse(destinationsAsString)


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full  min-h-[300px] lg:min-h-[300px]"
        className=""
        backgroundImage={destinations[0]?.image}
      >
        <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            {destinations[0]?.country}
          </h2>
          <p className="mt-4 text-left  text-base/6 text-neutral-200">
            {destinations[0]?.description}
          </p>
        </div>
      </WobbleCard>
      <WobbleCard 
      backgroundImage={destinations[1]?.image}
      containerClassName="col-span-1 min-h-[300px]">
        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          {destinations[1]?.country}
        </h2>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
          {destinations[1]?.description}
        </p>
      </WobbleCard>
      <WobbleCard 
      backgroundImage={destinations[2]?.image}
      containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[300px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            {destinations[2]?.country} 
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
            {destinations[2]?.description}
          </p>
        </div>
      </WobbleCard>
    </div>
  );
}
