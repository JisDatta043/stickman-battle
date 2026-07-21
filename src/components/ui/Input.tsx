"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</label>}
      <input
        className={twMerge(
          clsx(
            "w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 tracking-wider font-mono uppercase focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-400 font-medium tracking-wide mt-0.5">{error}</span>}
    </div>
  );
};
