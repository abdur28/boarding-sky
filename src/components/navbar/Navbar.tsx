"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem } from "../ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { FloatingNav } from "../ui/floating-navbar";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";

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
                <Link href="/hotel" className="hover:text-second">Hotel</Link>
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
                <MenuItem setActive={setActive} active={active} item="Login" >
                  <ClerkLoading>
                    <div className="flex flex-row items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-second"></div>
                      <span className="text-sm">Loading...</span>
                    </div>
                  </ClerkLoading>
                  <ClerkLoaded>
                    <SignedIn>
                      <div className="flex flex-col space-y-4 text-sm">
                          <HoveredLink href="/dashboard">Dashboard</HoveredLink>
                          <SignOutButton>
                            <p className="text-black hover:text-second hover:cursor-pointer">
                              Logout
                            </p>
                          </SignOutButton>
                      </div>
                    </SignedIn>
                    <SignedOut>
                      <div className="flex flex-col space-y-4 text-sm">
                          <HoveredLink href="/sign-in">Login</HoveredLink>
                          <HoveredLink href="/sign-up">Register</HoveredLink>
                      </div>
                    </SignedOut>
                  </ClerkLoaded>
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