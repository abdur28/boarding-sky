"use client";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface Links {
  label: string;
  icon: React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

interface SidebarBodyProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

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
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar: React.FC<{
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}> = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = React.forwardRef<HTMLDivElement, SidebarBodyProps>(
  ({ children, className, ...props }, ref) => {
    const { open, setOpen, animate } = useSidebar();
    
    return (
      <>
        {/* Desktop Sidebar */}
        <motion.div
          ref={ref}
          className={cn(
            "h-full md:px-4 md:py-4  hidden md:flex md:flex-col bg-neutral-100 w-[300px] flex-shrink-0",
            className
          )}
          animate={{
            width: animate ? (open ? "300px" : "60px") : "300px",
          }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          {...props}
        >
          <div className="md:flex hidden flex-col h-full">
            {children}
          </div>
        </motion.div>

        {/* Mobile Sidebar */}
        <div
          className={cn(
            "min-h-14 px-4 py-4 flex md:hidden bg-neutral-100 dark:bg-neutral-800 w-full",
            className
          )}
        >
          <div className="flex flex-row items-center justify-between w-full gap-4">
            {children}
          </div>
        </div>
      </>
    );
  }
);

SidebarBody.displayName = "SidebarBody";

interface SidebarLinkProps {
  link: Links;
  onClick?: () => void;
  className?: string;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({
  link,
  onClick,
  className,
  ...props
}) => {
  const { open, animate } = useSidebar();
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-start hover:cursor-pointer gap-2 group/sidebar",
        "py-1 md:py-2",
        "whitespace-nowrap flex-shrink-0",
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
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre !p-0 !m-0 md:block hidden"
      >
        {link.label}
      </motion.span>
    </div>
  );
};