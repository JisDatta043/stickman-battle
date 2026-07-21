"use client";

import React, { useState } from "react";
import { HealthBar } from "./HealthBar";
import { RoundTimer } from "./RoundTimer";
import { Pause, Maximize2, Minimize2, Volume2, VolumeX } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useGameStore } from "@/stores/useGameStore";
import { useSettingsStore } from "@/stores/useSettingsStore";

interface GameHUDProps {
  onPause: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ onPause }) => {
  const { p1Name, p1Color, p1Hp, p2Name, p2Color, p2Hp } = usePlayerStore();
  const { roundTimer, scoreP1, scoreP2 } = useGameStore();
  const { isMuted, toggleMute } = useSettingsStore();

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="absolute top-0 inset-x-0 z-30 p-4 sm:p-6 flex items-start justify-between gap-4 pointer-events-none select-none">
      {/* Player 1 Health Bar */}
      <div className="pointer-events-auto">
        <HealthBar
          name={p1Name}
          hp={p1Hp}
          color={p1Color}
          side="left"
          score={scoreP1}
        />
      </div>

      {/* Center Round Timer & Control Action Icons */}
      <div className="flex flex-col items-center gap-2 pointer-events-auto">
        <RoundTimer timer={roundTimer} />

        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-xl p-1 shadow-lg backdrop-blur-md">
          <button
            onClick={onPause}
            className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Pause Game"
          >
            <Pause className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={toggleMute}
            className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Toggle Mute"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Player 2 / Bot Health Bar */}
      <div className="pointer-events-auto">
        <HealthBar
          name={p2Name}
          hp={p2Hp}
          color={p2Color}
          side="right"
          score={scoreP2}
        />
      </div>
    </div>
  );
};
