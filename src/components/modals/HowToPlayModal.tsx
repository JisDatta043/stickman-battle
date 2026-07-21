"use client";

import React from "react";
import { Modal } from "../ui/Modal";
import { ShieldAlert, Zap, Trophy } from "lucide-react";

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Play" maxWidth="lg">
      <div className="flex flex-col gap-6 text-slate-300 text-sm">
        {/* Keybindings grid */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Keyboard Controls</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <span className="font-semibold text-slate-200">Move Left / Right</span>
              <div className="flex gap-1 font-mono text-xs">
                <span className="px-2 py-1 bg-slate-800 rounded text-cyan-400 font-bold border border-slate-700">A / D</span>
                <span className="px-2 py-1 bg-slate-800 rounded text-slate-400 border border-slate-700">← →</span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <span className="font-semibold text-slate-200">Jump / Vault</span>
              <div className="flex gap-1 font-mono text-xs">
                <span className="px-2 py-1 bg-slate-800 rounded text-cyan-400 font-bold border border-slate-700">W / Space</span>
                <span className="px-2 py-1 bg-slate-800 rounded text-slate-400 border border-slate-700">↑</span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <span className="font-semibold text-slate-200">Punch (Fast)</span>
              <div className="flex gap-1 font-mono text-xs">
                <span className="px-2 py-1 bg-slate-800 rounded text-blue-400 font-bold border border-slate-700">J</span>
                <span className="px-2 py-1 bg-slate-800 rounded text-slate-400 border border-slate-700">Z</span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <span className="font-semibold text-slate-200">Kick (Heavy)</span>
              <div className="flex gap-1 font-mono text-xs">
                <span className="px-2 py-1 bg-slate-800 rounded text-red-400 font-bold border border-slate-700">K</span>
                <span className="px-2 py-1 bg-slate-800 rounded text-slate-400 border border-slate-700">X</span>
              </div>
            </div>
          </div>
        </div>

        {/* Combat Mechanics */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Combat Rules</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
              <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100">Punch vs Kick:</strong> Punches deal 10 HP damage with quick execution. Heavy Kicks deal 18 HP damage with high knockback.
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100">Knockback Physics:</strong> Taking heavy hits launches stickmen across the arena. Use platforms to dodge incoming attacks!
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
              <Trophy className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100">Round Time Limit:</strong> Each round lasts 60 seconds. Knock out your opponent or hold higher remaining HP to claim victory!
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
