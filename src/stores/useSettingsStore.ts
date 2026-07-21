import { create } from "zustand";
import { soundSynth } from "@/utils/audioSynth";

interface SettingsState {
  sfxVolume: number;
  isMuted: boolean;
  showMobileControls: boolean;
  particlesEnabled: boolean;

  // Actions
  setSfxVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleMobileControls: () => void;
  toggleParticles: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  sfxVolume: 0.8,
  isMuted: false,
  showMobileControls: true,
  particlesEnabled: true,

  setSfxVolume: (volume) => {
    soundSynth.setVolume(volume);
    set({ sfxVolume: volume });
  },
  toggleMute: () =>
    set((state) => {
      const nextMute = !state.isMuted;
      soundSynth.setMuted(nextMute);
      return { isMuted: nextMute };
    }),
  toggleMobileControls: () => set((state) => ({ showMobileControls: !state.showMobileControls })),
  toggleParticles: () => set((state) => ({ particlesEnabled: !state.particlesEnabled })),
}));
