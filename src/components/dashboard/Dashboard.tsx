"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { InfoIcon, Users2Icon, PlaneIcon, Hotel, Car, FileText, HandCoinsIcon, Handshake, MapIcon, BadgeCheck } from "lucide-react";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils"
import Info from "./Info";
import Users from "./Users";
import Transactions from "./Transactions";
import Bookings from "./Bookings";
import Airlines from "./Airlines";
import Settings from "./Settings";
import Blogs from "./Blogs";
import Tours from "./Tours";
import Cars from "./Cars";
import Hotels from "./Hotels";
import Deals from "./Deals";
import Intro from "./Intro";

const allLinks = [
  {
    label: "General Information",
    id: "info",
    icon: (
      <InfoIcon className="text-neutral-700 h-5 w-5 flex-shrink-0" />
    ),
    roles: ["admin"]
  },
  {
    label: "Users",
    id: "users",
    icon: (
      <Users2Icon className="text-neutral-700 h-5 w-5 flex-shrink-0" />
    ),
    roles: ["admin"]
  },
  {
    label: "Bookings",
    id: "bookings",
    icon: (
      <Handshake className="text-neutral-700 h-5 w-5 flex-shrink-0" />
    ),
    roles: ["admin", "manager", "editor", "user"]
  },
  {
    label: "Transactions",
    id: "transactions",
    icon: (
      <HandCoinsIcon className="text-neutral-700 h-5 w-5 flex-shrink-0" />
    ),
    roles: ["admin", "manager", "editor", "user"]
  },
  {
    label: "Airlines",
    id: "airlines",
    icon: (
      <PlaneIcon className="text-neutral-700 h-5 w-5 flex-shrink-0" />
    ),
    roles: ["admin", "manager", "editor"]
  },
  {
    label: "Hotels",
    id: "hotels",
    icon: (
      <Hotel className="text-neutral-700 h-5 w-5 flex-shrink-0" />
    ),
    roles: ["admin", "manager", "editor"]
  },
  {
    label: "Cars",
    id: "cars",
    icon: (
      <Car className="text-neutral-700 h-5 w-5 flex-shrink-0" />
    ),
    roles: ["admin", "manager", "editor"]
  },
  {
    label: "Tours",
    id: "tours",
    icon: (
      <MapIcon className="text-neutral-700 h-5 w-5 flex-shrink-0" />
    ),
    roles: ["admin", "manager", "editor"]
  },
  {
    label: "Deals",
    id: "deals",
    icon: (
      <BadgeCheck className="text-neutral-700 h-5 w-5 flex-shrink-0" />
    ),
    roles: ["admin", "manager", "editor"]
  },
  {
    label: "Blogs",
    id: "blogs",
    icon: (
      <FileText className="text-neutral-700 h-5 w-5 flex-shrink-0" />
    ),
    roles: ["admin", "manager", "editor"]
  },
  {
    label: "Settings",
    id: "settings",
    icon: (
      <IconSettings className="text-neutral-700 h-5 w-5 flex-shrink-0" />
    ),
    roles: ["admin", "manager", "editor", "user"]
  },
];

export function Dashboard({ userAsString }: { userAsString: string }) {
  const [active, setActive] = useState("dashboard");
  const user = JSON.parse(userAsString);
  const role = user?.role?.toLowerCase() || "user";
  
  // Filter links based on user role
  const links = allLinks.filter(link => link.roles.includes(role));
  
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-full"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between flex w-full min-h-14 md:h-full  md:gap-10 ">
          <div className="flex flex-row md:flex-col justify-between md:min-h-[calc(75vh)] flex-1 w-full ">
            <div className="md:hidden flex justify-center items-center">
              {open ? <Logo setActive={setActive} /> : <LogoIcon setActive={setActive}/>}
            </div>
            <div className="hidden md:flex">
              {open ? <Logo  setActive={setActive}/> : <LogoIcon setActive={setActive} />}
            </div>
            <div className="md:mt-8 flex md:flex-col flex-row flex-wrap md:flex-nowrap gap-4 md:gap-2 md:max-w-full max-w-[calc(100%-8rem)]  justify-center flex-1">
              {links.map((link, idx) => (
                <SidebarLink key={idx} onClick={() => setActive(link.id)} link={link} />
              ))}
            </div>
            <div className="md:mt-8 flex justify-center items-center md:justify-start">
              <SidebarLink
                link={{
                  label: (user?.firstName + " " + user?.lastName),
                  icon: (
                    <Image
                      src={user?.profilePicture}
                      className="h-7 w-7 md:flex-shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
              />
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <Content active={active} role={role} user={user}/>
    </div>
  );
}

export const Logo = ({ setActive }: { setActive: (item: string) => void}) => {
  return (
    <div 
    onClick={() => setActive("dashboard")}
    className="font-normal flex space-x-2 items-center text-sm hover:cursor-pointer text-black py-1 relative z-20">
      <Image src="/logo.png" alt="logo" width={50} height={50} className="h-7 w-7"/>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Dashboard
      </motion.span>
    </div>
  );
};

export const LogoIcon = ({setActive}: { setActive: (item: string) => void}) => {
  return (
    <div 
    onClick={() => setActive("dashboard")}
    className="font-normal flex space-x-2 items-center text-sm hover:cursor-pointer text-black py-1 relative z-20">
      <Image src="/logo.png" alt="logo" width={50} height={50} className="h-7 w-7"/>
    </div>
  );
};

const Content = ({ active, role, user }: { active: string; role: string, user: any }) => {
  // Check if user has access to the current section
  const hasAccess = (sectionId: string) => {
    const link = allLinks.find(l => l.id === sectionId);
    return link ? link.roles.includes(role) : true; // Allow access to dashboard by default
  };

  if (!hasAccess(active)) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-red-500">You don't have access to this section.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="px-2 py-10 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        {active === "dashboard" && <Intro role={role}/>}
        {active === "info" && hasAccess("info") && <Info />}
        {active === "users" && hasAccess("users") && <Users />}
        {active === "bookings" && hasAccess("bookings") && <Bookings userAsString={JSON.stringify(user)}/>}
        {active === "transactions" && hasAccess("transactions") && <Transactions userAsString={JSON.stringify(user)} />}
        {active === "airlines" && hasAccess("airlines") && <Airlines />}
        {active === "hotels" && hasAccess("hotels") && <Hotels />}
        {active === "cars" && hasAccess("cars") && <Cars />}
        {active === "tours" && hasAccess("tours") && <Tours />}
        {active === "deals" && hasAccess("deals") && <Deals role={role}/>}
        {active === "blogs" && hasAccess("blogs") && <Blogs />}
        {active === "settings" && hasAccess("settings") && <Settings />}
      </div>
    </div>
  );
};