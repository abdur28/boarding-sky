"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut } from "@clerk/nextjs";
import { useUser } from "@/hooks/useUser";
import { Loader2 } from "lucide-react";

// Animation transition configuration
const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

// Types for our components
interface MenuItemProps {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}

interface MenuProps {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}

interface ProductItemProps {
  title: string;
  description: string;
  href: string;
  src: string;
}

interface HoveredLinkProps {
  children: React.ReactNode;
  href: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  setActive,
  active,
  item,
  children,
}) => {
  const { user, getUser, isLoading } = useUser();
  const [userImage, setUserImage] = useState<any>('/profile.png');

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user && user.profilePicture) {
      setUserImage(user.profilePicture);
    } 
  }, [user]);

  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.div
        transition={{ duration: 0.3 }}
        className="cursor-pointer justify-center items-center flex h-full w-full hover:text-second text-black hover:opacity-[0.9]"
      >
        {item === "Login" ? (
          <>
          <ClerkLoading>
            <div className="w-7 h-7 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-second" />
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            {isLoading ? (
              <div className="w-7 h-7 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-second" />
              </div>
            ) : (
              <>
                <SignedOut>
                  <Image
                    src="/profile.png"
                    width={30}
                    height={30}
                    alt="profile"
                    className="w-7 h-7 rounded-full object-cover"
                  />
                </SignedOut>
                <SignedIn>
                  <Image
                    src={userImage}
                    width={30}
                    height={30}
                    alt="profile"
                    className="w-7 h-7 rounded-full object-cover"
                  />
                </SignedIn>
              </>
            )}
          </ClerkLoaded>
          </>
        ) : (
          <span>{item}</span>
        )}
      </motion.div>

      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-white backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] shadow-xl"
              >
                {isLoading && item === "Login" ? (
                  <motion.div layout className="w-max h-full p-4 flex items-center justify-center min-w-[150px]">
                    <Loader2 className="h-5 w-5 animate-spin text-second" />
                  </motion.div>
                ) : (
                  <motion.div layout className="w-max h-full p-4">
                    {children}
                  </motion.div>
                )}
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu: React.FC<MenuProps> = ({ setActive, children }) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative shadow-input flex h-full justify-center items-center space-x-4 px-8 py-6"
    >
      {children}
    </nav>
  );
};

export const ProductItem: React.FC<ProductItemProps> = ({
  title,
  description,
  href,
  src,
}) => {
  return (
    <Link href={href} className="flex space-x-2">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem]">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink: React.FC<HoveredLinkProps> = ({ children, ...rest }) => {
  return (
    <Link
      {...rest}
      className="text-black hover:text-second transition-colors duration-200"
    >
      {children}
    </Link>
  );
};