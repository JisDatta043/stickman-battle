"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, Home } from "lucide-react";
import { Button } from "../ui/Button";
import { useGameStore } from "@/stores/useGameStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useRouter } from "next/navigation";

interface VictoryOverlayProps {
  onRestartRound: () => void;
}

export const VictoryOverlay: React.FC<VictoryOverlayProps> = ({ onRestartRound }) => {
  const { status, roundResult, scoreP1, scoreP2 } = useGameStore();
  const { p1Name, p2Name } = usePlayerStore();
  const router = useRouter();

  if (status !== "roundOver" || !roundResult) return null;

  const handleExitToMenu = () => {
    useGameStore.getState().resetGame();
    router.push("/");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85 }}
          className="w-full max-w-md bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 text-center shadow-2xl shadow-cyan-500/20 flex flex-col items-center gap-5"
        >
          {/* Trophy Header Icon */}
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-wide">
              {roundResult.winnerId ? `${roundResult.winnerName} Wins!` : "Round Draw!"}
            </h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-1">
              {roundResult.reason === "knockout" ? "K.O. VICTORY" : "TIME UP"}
            </p>
          </div>

          {/* Match Score Summary */}
          <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-around">
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400 font-semibold">{p1Name}</span>
              <span className="text-3xl font-extrabold text-blue-400 font-mono">{scoreP1}</span>
            </div>

            <span className="text-slate-600 font-bold text-xl">VS</span>

            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400 font-semibold">{p2Name}</span>
              <span className="text-3xl font-extrabold text-red-400 font-mono">{scoreP2}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 w-full mt-2">
            <Button variant="primary" size="lg" className="w-full" onClick={onRestartRound}>
              <RotateCcw className="w-5 h-5" />
              Play Next Round
            </Button>

            <Button variant="outline" size="md" className="w-full" onClick={handleExitToMenu}>
              <Home className="w-4 h-4" />
              Exit to Main Menu
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
