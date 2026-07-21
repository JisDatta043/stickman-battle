"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { soundSynth } from "@/utils/audioSynth";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className,
  onClick,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30 focus:ring-cyan-400",
    secondary:
      "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/80 shadow-md focus:ring-slate-500",
    danger:
      "bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-lg shadow-red-500/25 border border-red-500/30 focus:ring-red-400",
    outline:
      "bg-transparent hover:bg-slate-800/60 text-slate-200 border-2 border-slate-700 hover:border-slate-500 focus:ring-slate-500",
    ghost: "bg-transparent hover:bg-slate-800/40 text-slate-300 hover:text-white focus:ring-slate-600",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundSynth.playClick();
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      whileHover={{ scale: props.disabled ? 1 : 1.02 }}
      whileTap={{ scale: props.disabled ? 1 : 0.97 }}
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      onClick={handleClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};
