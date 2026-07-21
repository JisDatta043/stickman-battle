"use client";

import React, { useState } from "react";
import { usePhaser } from "@/hooks/usePhaser";
import { useGameInput } from "@/hooks/useGameInput";
import { GameHUD } from "./GameHUD";
import { PauseModal } from "./PauseModal";
import { VictoryOverlay } from "./VictoryOverlay";
import { MobileControls } from "./MobileControls";
import { useGameStore } from "@/stores/useGameStore";
import { Loader2 } from "lucide-react";

export const GameCanvas: React.FC = () => {
  const containerId = "phaser-game-container";
  const { battleScene, isReady } = usePhaser(containerId);
  const [isPaused, setIsPaused] = useState(false);

  const {
    triggerMoveLeft,
    triggerMoveRight,
    triggerJump,
    triggerPunch,
    triggerKick,
  } = useGameInput(battleScene?.player1);

  const handlePause = () => {
    setIsPaused(true);
    useGameStore.getState().setPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
    useGameStore.getState().setPaused(false);
  };

  const handleRestartRound = () => {
    if (battleScene) {
      battleScene.scene.restart();
    }
  };

  return (
    <div className="relative w-full h-full max-w-[1280px] max-h-[720px] aspect-[16/9] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/10 flex items-center justify-center">
      {/* Loading Overlay until Phaser canvas is ready */}
      {!isReady && (
        <div className="absolute inset-0 z-40 bg-slate-950 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
          <p className="text-slate-300 font-medium text-sm tracking-wider">Loading Stickman Arena...</p>
        </div>
      )}

      {/* Phaser Canvas Container */}
      <div id={containerId} className="w-full h-full flex items-center justify-center" />

      {/* React Game HUD */}
      {isReady && <GameHUD onPause={handlePause} />}

      {/* Pause Menu Modal */}
      <PauseModal isOpen={isPaused} onClose={handleResume} />

      {/* Victory / Defeat Modal */}
      <VictoryOverlay onRestartRound={handleRestartRound} />

      {/* On-Screen Mobile Touch Controls Overlay */}
      {isReady && (
        <MobileControls
          onMoveLeft={triggerMoveLeft}
          onMoveRight={triggerMoveRight}
          onJump={triggerJump}
          onPunch={triggerPunch}
          onKick={triggerKick}
        />
      )}
    </div>
  );
};
