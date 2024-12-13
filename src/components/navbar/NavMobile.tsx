'use client'

import { ClerkLoaded, ClerkLoading, SignedOut, SignedIn, SignOutButton } from "@clerk/nextjs"
import { useState } from "react"
import ToggleButton from "./ToogleButton"
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Loader2, User2 } from "lucide-react";

const variants = {
    open: {
        height: "auto",
        x: 0,
        opacity: 1,
        transition: { 
            duration: 0.3 
        }
      },
      closed: {
        height: 0,
        x: -500,
        opacity: 0,
        transition: { 
            duration: 0.3,
        }
      }
};

const linkVariants = {
    open: { 
        opacity: 1,
        y: 0,
        transition: { duration: 0.7 }
    },
    closed: { 
        opacity: 0,
        y: 20,
        transition: { duration: 0.7 }
    }
}

const NavMobile = ({ setOpen, open }: { setOpen: React.Dispatch<React.SetStateAction<boolean>>; open: boolean }) => {
    const [drop, setDrop] = useState('')
    const links = [
        {
            name: "Hotels",
            link: "/hotels",
        },
        {
            name: "Flight",
            link: "/flight",
        },
        {
            name: "Car",
            link: "/car",
        },
        {
            name: "Tour",
            link: "/tour",
        },
        {
            name: "Blog",
            link: "/blog",
        },
        {
            name: "Pages", 
            link: "",
            subItems: [
                {
                    name: "About",
                    link: "/about",
                },
                {
                    name: "Contact",
                    link: "/contact",
                },
                {
                    name: "Privacy Policy",
                    link: "/privacy-policy",
                },
            ]
        },
    ]

    return (
        <motion.div 
        className="h-full w-full"
        initial="closed" animate={open ? "open" : "closed"}>
            <motion.div className="inset-x-0 mx-auto px-5 py-3  space-x-4 flex justify-between items-center">
            <Link
            href="/"
            className="w-full h-full flex justify-center gap-1 items-center"
            >
                    <Image
                    src="/logo.png"
                    width={70}
                    height={70}
                    alt="logo"
                    className="w-10 h-10"
                    />
                    <span className="text-xl font-bold  text-black w-full h-full flex  items-center">BoardingSky</span>
            </Link>
            <ToggleButton setOpen={setOpen} />
            </motion.div> 
            <motion.div 
            initial="closed" 
            animate={open ? "open" : "closed"} 
            variants={variants} 
            className="flex flex-col w-full h-full ">
                <motion.div
                className="mb-7 px-5 pb-10 border-b-2 border-gray-300"
                >
                    <motion.div
                    variants={linkVariants}
                    animate={open ? "open" : "closed"}
                    key={'Home'}
                    className="py-3 px-3 border-t-2 flex flex-row justify-between border-gray-300"
                    >
                        <div className="flex flex-col gap-2">
                            <motion.div
                            whileTap={{ scale: 0.9 }}
                            >
                                <Link href={"/"} className="text-lg"
                                onClick={() => setOpen(false)}
                                >{"Home"}</Link>
                            </motion.div>
                        </div>
                    </motion.div>
                    <SignedIn>
                        <motion.div
                        variants={linkVariants}
                        animate={open ? "open" : "closed"}
                        key={'Dashboard'}
                        className="py-3 px-3 border-t-2 flex flex-row justify-between border-gray-300"
                        >
                            <div className="flex flex-col gap-2">
                                <motion.div
                                whileTap={{ scale: 0.9 }}
                                >
                                    <Link href={"/dashboard"} className="text-lg"
                                    onClick={() => setOpen(false)}
                                    >{"Dashboard"}</Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </SignedIn>
                {links.map((link) => (
                    <motion.div
                    variants={linkVariants}
                    animate={open ? "open" : "closed"}
                    key={link.name}
                    className="py-3 px-3 border-t-2 flex flex-row justify-between border-gray-300"
                    >
                        <div className="flex flex-col gap-2">
                            <motion.div
                            whileTap={{ scale: 0.9 }}
                            >
                                {link.link === "" ? <span className="text-lg">{link.name}</span> : <Link href={link.link} className="text-lg"
                                onClick={() => setOpen(false)}
                                >{link.name}</Link>}
                            </motion.div>
                            {drop === link.name && link.subItems && link.subItems.map((subItem) => (
                                <motion.div
                                key={subItem.name}
                                whileTap={{ scale: 0.9 }}
                                >
                                    <Link href={subItem.link} className=""
                                    onClick={() => setOpen(false)}
                                    >{subItem.name}</Link>
                                </motion.div>
                            ))}
                        </div>
                        {link.subItems && (
                            <div onClick={() => {
                                setDrop(drop === link.name ? '' : link.name)
                            }} className="cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${drop === link.name ? 'rotate-180' : ''} w-6 h-6`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                        )}
                    </motion.div>
                ))}   
                    <ClerkLoading>
                        <motion.div
                        variants={linkVariants}
                        animate={open ? "open" : "closed"}
                        key={'signout'}
                        className="py-3 px-3 border-t-2 flex flex-row justify-between border-gray-300"
                        >
                            <div className="flex flex-col gap-2">
                                <motion.div
                                whileTap={{ scale: 0.9 }}
                                className="flex flex-row items-center gap-2"
                                >
                                    <User2 className="h-6 w-6" />
                                    <p className="text-lg"
                                    >{"Logout"}</p>
                                </motion.div>
                            </div>
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </motion.div>
                    </ClerkLoading>
                    <ClerkLoaded>
                    <SignedOut>
                        <motion.div
                        variants={linkVariants}
                        animate={open ? "open" : "closed"}
                        key={'login'}
                        className="py-3 px-3 border-t-2 flex flex-row justify-between border-gray-300"
                        >
                            <div className="flex flex-col gap-2">
                                <motion.div
                                whileTap={{ scale: 0.9 }}
                                className="flex flex-row items-center gap-2"
                                >
                                    <User2 className="h-6 w-6" />
                                    <Link href={"/sign-in"} className="text-lg"
                                    onClick={() => setOpen(false)}
                                    >{"Login"}</Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </SignedOut>
                    <SignedIn>
                        <motion.div
                        variants={linkVariants}
                        animate={open ? "open" : "closed"}
                        key={'signout'}
                        className="py-3 px-3 border-t-2 flex flex-row justify-between border-gray-300"
                        >
                            <SignOutButton>
                            <div className="flex flex-col gap-2">
                                <motion.div
                                whileTap={{ scale: 0.9 }}
                                className="flex flex-row items-center gap-2"
                                >
                                    <User2 className="h-6 w-6" />
                                   <p className="text-lg"
                                    >{"Logout"}</p>
                                </motion.div>
                            </div>
                            </SignOutButton>
                        </motion.div>
                    </SignedIn>
                    </ClerkLoaded>
                    <motion.div className="flex flex-col text-sm gap-5 border-t-2 border-gray-300 pt-5">
                        <div className="flex flex-row items-center gap-8 ">
                            <a href="mailto:example@email.com" className="flex flex-row items-center gap-2">
                                <Image
                                src="/email.png"
                                alt="email"
                                width={20}
                                height={20}
                                className="object-cover"
                                />
                                <p>example@email.com</p>
                            </a>
                            <a href="tel:+123456789" className="flex flex-row items-center gap-2">
                                <Image
                                src="/phone-call.png"
                                alt="phone"
                                width={20}
                                height={20}
                                className="object-cover"
                                />
                                <p>+123 456 789</p>
                            </a>
                        </div>
                    </motion.div>   
                </motion.div>  
            </motion.div>    
        </motion.div>
    )
}   

export default NavMobile