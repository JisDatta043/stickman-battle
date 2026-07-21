"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: "glass" | "solid";
}

export const Card: React.FC<CardProps> = ({ children, className, variant = "glass", ...props }) => {
  const baseStyles = "rounded-2xl p-6 transition-all duration-300";

  const variants = {
    glass:
      "bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl shadow-black/50 text-slate-100 hover:border-slate-700/80",
    solid: "bg-slate-900 border border-slate-800 shadow-xl text-slate-100",
  };

  return (
    <motion.div className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {children}
    </motion.div>
  );
};
