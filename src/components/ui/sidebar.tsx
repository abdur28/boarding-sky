"use client";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";

interface Links {
  label: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <div className="hidden md:flex h-full"><DesktopSidebar 
      className="w-full h-full flex items-center justify-center"
      {...props} /></div>
      <div className="md:hidden flex w-full min-h-14"> <MobileSidebar
      className="w-full h-full flex items-center justify-center"
      {...(props as React.ComponentProps<"div">)} /></div>     
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4  hidden md:flex md:flex-col bg-neutral-100  w-[300px] flex-shrink-0",
          className
        )}
        animate={{
          width: animate ? (open ? "300px" : "60px") : "300px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "min-h-14 px-4 flex md:hidden items-center justify-center bg-neutral-100 dark:bg-neutral-800 w-full",
        className
      )}
      {...props}
    >
      <div className="flex gap-4 w-full justify-between items-center">
        {children}
      </div>
    </div>
  );
};

export const SidebarLink = ({
  link,
  onClick,
  className,
  ...props
}: {
  link: Links;
  onClick?: () => void;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-start hover:cursor-pointer gap-2 group/sidebar py-2",
        "md:py-2", // Desktop padding
        "py-1", // Mobile padding
        className
      )}
      {...props}
    >
      {link.icon}

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre  !p-0 !m-0 md:block hidden"
      >
        {link.label}
      </motion.span>
    </div>
  );
};