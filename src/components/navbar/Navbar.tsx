"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem } from "../ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { FloatingNav } from "../ui/floating-navbar";

const Navbar = ({ className }: { className?: string }) => {
  const [active, setActive] = useState<string | null>(null);
  return (
    <>
    <div
      className={cn(" inset-x-0 w-full md:flex hidden bg-fourth mx-auto lg:px-32 md:px-18 px-10 z-50", className)}
    >
      <div className="w-full h-full flex flex-row justify-between items-center">
        <div className="w-1/4 h-full">
            <Link
            href="/"
            className="w-full h-full flex gap-1 justify-center items-center"
            >
                <Image
                src="/logo.png"
                width={70}
                height={70}
                alt="logo"
                className="w-12 h-12"
                />
                <span className="text-2xl font-bold text-black w-full h-full flex  items-center">BoardingSky</span>
            </Link>
        </div>
        <div className="hidden md:flex font-semibold ">
            <Menu setActive={setActive} >
                <Link href="/" className="hover:text-second">Home</Link>
                <Link href="/flight" className="hover:text-second">Flight</Link>
                <Link href="/car" className="hover:text-second">Car</Link>
                <Link href="/tour" className="hover:text-second">Tour</Link>
                <Link href="/blog" className="hover:text-second">Blog</Link>
                <MenuItem setActive={setActive} active={active} item="Pages">
                <div className="flex flex-col space-y-4 text-sm">
                    <HoveredLink href="/about">About</HoveredLink>
                    <HoveredLink href="/contact">Contact</HoveredLink>
                    <HoveredLink href="/privacy-policy">Privacy Policy</HoveredLink>
                </div>
                </MenuItem>
                <div className="lg:w-20 md:w-10"></div>
                <MenuItem setActive={setActive} active={active} item="Login">
                <div className="flex flex-col space-y-4 text-sm">
                    <HoveredLink href="/dashboard">Dashboard</HoveredLink>
                    <HoveredLink href="/profile">Profile</HoveredLink>
                    <HoveredLink href="/Logout">Logout</HoveredLink>
                </div>
                </MenuItem>
            </Menu>
        </div>
      </div>
    </div>
    <div className="md:hidden h-full w-full bg-fourth">
      <div className="relative  w-full">
        <FloatingNav />
      </div>
    </div>
    </>
  );
}

export default Navbar