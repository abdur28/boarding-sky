"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import ToggleButton from "../navbar/ToogleButton";
import NavMobile from "../navbar/NavMobile";

export const FloatingNav = ({
  className,
}: {
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
        setOpen(false);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
          setOpen(false);
        }
      }
    }
  });

  return (
    <>
    <NavMobile setOpen={setOpen} open={open} />
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -700,
        }}
        animate={{
          y: visible ? 0 : -700,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex w-full fixed top-0 inset-x-0 mx-auto bg-fourth shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] ",
          className
        )}
      >
        <NavMobile setOpen={setOpen} open={open} />
      </motion.div>
    </AnimatePresence>
    </>
  );
};
