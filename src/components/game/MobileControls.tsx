"use client";

import React from "react";
import { ArrowLeft, ArrowRight, ArrowUp, Zap, Flame } from "lucide-react";
import { useSettingsStore } from "@/stores/useSettingsStore";

interface MobileControlsProps {
  onMoveLeft: (active: boolean) => void;
  onMoveRight: (active: boolean) => void;
  onJump: () => void;
  onPunch: () => void;
  onKick: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onJump,
  onPunch,
  onKick,
}) => {
  const { showMobileControls } = useSettingsStore();

  if (!showMobileControls) return null;

  return (
    <div className="absolute inset-x-0 bottom-4 pointer-events-none z-30 px-6 flex items-end justify-between select-none">
      {/* Left Touch D-Pad (Move Left & Right) */}
      <div className="flex gap-3 pointer-events-auto">
        <button
          onTouchStart={() => onMoveLeft(true)}
          onTouchEnd={() => onMoveLeft(false)}
          onMouseDown={() => onMoveLeft(true)}
          onMouseUp={() => onMoveLeft(false)}
          onMouseLeave={() => onMoveLeft(false)}
          className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-cyan-400 active:bg-cyan-500/20 active:scale-95 flex items-center justify-center shadow-lg backdrop-blur-md"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>

        <button
          onTouchStart={() => onMoveRight(true)}
          onTouchEnd={() => onMoveRight(false)}
          onMouseDown={() => onMoveRight(true)}
          onMouseUp={() => onMoveRight(false)}
          onMouseLeave={() => onMoveRight(false)}
          className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-cyan-400 active:bg-cyan-500/20 active:scale-95 flex items-center justify-center shadow-lg backdrop-blur-md"
        >
          <ArrowRight className="w-7 h-7" />
        </button>
      </div>

      {/* Right Action Buttons (Jump, Punch, Kick) */}
      <div className="flex gap-3 items-end pointer-events-auto">
        {/* Jump Button */}
        <button
          onClick={onJump}
          className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-emerald-400 active:bg-emerald-500/20 active:scale-95 flex items-center justify-center shadow-lg backdrop-blur-md mb-2"
        >
          <ArrowUp className="w-7 h-7" />
        </button>

        {/* Punch Button (J) */}
        <button
          onClick={onPunch}
          className="w-16 h-16 rounded-2xl bg-blue-600/80 border border-blue-400/40 text-white active:bg-blue-500 active:scale-95 flex flex-col items-center justify-center shadow-lg shadow-blue-500/20 backdrop-blur-md"
        >
          <Zap className="w-6 h-6 fill-current" />
          <span className="text-[9px] font-black uppercase">PUNCH</span>
        </button>

        {/* Kick Button (K) */}
        <button
          onClick={onKick}
          className="w-16 h-16 rounded-2xl bg-red-600/80 border border-red-400/40 text-white active:bg-red-500 active:scale-95 flex flex-col items-center justify-center shadow-lg shadow-red-500/20 backdrop-blur-md"
        >
          <Flame className="w-6 h-6 fill-current" />
          <span className="text-[9px] font-black uppercase">KICK</span>
        </button>
      </div>
    </div>
  );
};
