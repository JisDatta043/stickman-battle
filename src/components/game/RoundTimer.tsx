"use client";

import React from "react";

interface RoundTimerProps {
  timer: number;
}

export const RoundTimer: React.FC<RoundTimerProps> = ({ timer }) => {
  const isLowTime = timer <= 10;

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`w-14 h-14 rounded-2xl bg-slate-900/90 border-2 flex items-center justify-center shadow-lg transition-all duration-300 ${
          isLowTime
            ? "border-rose-500 text-rose-400 shadow-rose-500/30 animate-bounce"
            : "border-cyan-500/40 text-cyan-400 shadow-cyan-500/20"
        }`}
      >
        <span className="font-mono text-2xl font-black tracking-tighter">
          {timer < 10 ? `0${timer}` : timer}
        </span>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">TIME</span>
    </div>
  );
};
