import { create } from "zustand";
import { COLOR_P1, COLOR_P2, MAX_HP } from "@/utils/constants";

interface PlayerState {
  p1Name: string;
  p1Color: string;
  p1Hp: number;

  p2Name: string;
  p2Color: string;
  p2Hp: number;

  // Actions
  setP1Name: (name: string) => void;
  setP1Color: (color: string) => void;
  setP1Hp: (hp: number | ((prev: number) => number)) => void;

  setP2Name: (name: string) => void;
  setP2Color: (color: string) => void;
  setP2Hp: (hp: number | ((prev: number) => number)) => void;

  resetPlayers: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  p1Name: "Player 1",
  p1Color: COLOR_P1,
  p1Hp: MAX_HP,

  p2Name: "Bot",
  p2Color: COLOR_P2,
  p2Hp: MAX_HP,

  setP1Name: (p1Name) => set({ p1Name }),
  setP1Color: (p1Color) => set({ p1Color }),
  setP1Hp: (hpOrFn) =>
    set((state) => ({
      p1Hp: Math.max(0, Math.min(MAX_HP, typeof hpOrFn === "function" ? hpOrFn(state.p1Hp) : hpOrFn)),
    })),

  setP2Name: (p2Name) => set({ p2Name }),
  setP2Color: (p2Color) => set({ p2Color }),
  setP2Hp: (hpOrFn) =>
    set((state) => ({
      p2Hp: Math.max(0, Math.min(MAX_HP, typeof hpOrFn === "function" ? hpOrFn(state.p2Hp) : hpOrFn)),
    })),

  resetPlayers: () =>
    set({
      p1Hp: MAX_HP,
      p2Hp: MAX_HP,
    }),
}));
