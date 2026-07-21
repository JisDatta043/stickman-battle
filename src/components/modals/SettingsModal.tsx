"use client";

import React from "react";
import { Modal } from "../ui/Modal";
import { Volume2, VolumeX, Smartphone, Sparkles } from "lucide-react";
import { useSettingsStore } from "@/stores/useSettingsStore";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    sfxVolume,
    isMuted,
    showMobileControls,
    particlesEnabled,
    setSfxVolume,
    toggleMute,
    toggleMobileControls,
    toggleParticles,
  } = useSettingsStore();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" maxWidth="md">
      <div className="flex flex-col gap-6 text-slate-200">
        {/* SFX Volume */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {isMuted || sfxVolume === 0 ? (
                <VolumeX className="w-5 h-5 text-rose-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-cyan-400" />
              )}
              <span className="font-semibold text-sm">Sound FX Volume</span>
            </div>

            <button
              onClick={toggleMute}
              className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                isMuted
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              {isMuted ? "Unmute" : "Mute Sound"}
            </button>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : sfxVolume}
            onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Mobile Controls Toggle */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="font-semibold text-sm">On-Screen Controls</div>
              <div className="text-xs text-slate-400">Show touch D-pad and action buttons on screen</div>
            </div>
          </div>

          <button
            onClick={toggleMobileControls}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
              showMobileControls ? "bg-cyan-500" : "bg-slate-800"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                showMobileControls ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Particle Effects Toggle */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <div className="font-semibold text-sm">Spark Particle FX</div>
              <div className="text-xs text-slate-400">Enable hit impact sparks for enhanced visuals</div>
            </div>
          </div>

          <button
            onClick={toggleParticles}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
              particlesEnabled ? "bg-cyan-500" : "bg-slate-800"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                particlesEnabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </Modal>
  );
};
