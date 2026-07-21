"use client";

import React from "react";
import { motion } from "framer-motion";

interface HealthBarProps {
  name: string;
  hp: number;
  maxHp?: number;
  color: string;
  side: "left" | "right";
  score: number;
}

export const HealthBar: React.FC<HealthBarProps> = ({
  name,
  hp,
  maxHp = 100,
  color,
  side,
  score,
}) => {
  const percentage = Math.max(0, Math.min(100, (hp / maxHp) * 100));

  return (
    <div className={`flex flex-col gap-1.5 w-full max-w-[320px] ${side === "right" ? "items-end" : "items-start"}`}>
      {/* Player Header Info */}
      <div className={`flex items-center gap-2 ${side === "right" ? "flex-row-reverse" : "flex-row"}`}>
        <span className="font-bold text-sm text-slate-100 tracking-wide">{name}</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          Score: {score}
        </span>
      </div>

      {/* HP Bar Outer Container */}
      <div className="relative w-full h-6 bg-slate-950/90 border border-slate-800 rounded-xl p-1 shadow-inner overflow-hidden flex items-center">
        {/* Animated Bar Fill */}
        <motion.div
          initial={{ width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className={`h-full rounded-lg shadow-md ${side === "right" ? "ml-auto" : "mr-auto"}`}
          style={{
            backgroundColor: color,
            boxShadow: `0 0 12px ${color}80`,
          }}
        />

        {/* Dynamic HP Text Overlay */}
        <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {Math.ceil(hp)} / {maxHp} HP
        </span>
      </div>
    </div>
  );
};
