"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const GameCanvas = dynamic(
  () => import("@/components/game/GameCanvas").then((mod) => mod.GameCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-slate-950 text-cyan-400">
        <Loader2 className="w-10 h-10 animate-spin" />
        <span className="text-slate-300 font-medium text-sm">Initializing Battle Arena...</span>
      </div>
    ),
  }
);

export default function GamePage() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#0a0c14] flex items-center justify-center p-2 sm:p-6 relative select-none">
      <GameCanvas />
    </main>
  );
}
