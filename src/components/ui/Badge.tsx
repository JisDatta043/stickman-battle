"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "neutral", className }) => {
  const base = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border";

  const variants = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    info: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    neutral: "bg-slate-800 text-slate-300 border-slate-700",
  };

  return <span className={twMerge(clsx(base, variants[variant], className))}>{children}</span>;
};
