import { create } from "zustand";
import { GameMode, GameStatus, RoundResult } from "@/types/game";
import { DEFAULT_ROUND_TIME } from "@/utils/constants";

interface GameState {
  mode: GameMode;
  status: GameStatus;
  roundTimer: number;
  isPaused: boolean;
  roundResult: RoundResult | null;
  scoreP1: number;
  scoreP2: number;

  // Actions
  setGameMode: (mode: GameMode) => void;
  setGameStatus: (status: GameStatus) => void;
  setRoundTimer: (time: number | ((prev: number) => number)) => void;
  togglePause: () => void;
  setPaused: (paused: boolean) => void;
  setRoundResult: (result: RoundResult | null) => void;
  incrementScoreP1: () => void;
  incrementScoreP2: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  mode: "bot",
  status: "idle",
  roundTimer: DEFAULT_ROUND_TIME,
  isPaused: false,
  roundResult: null,
  scoreP1: 0,
  scoreP2: 0,

  setGameMode: (mode) => set({ mode }),
  setGameStatus: (status) => set({ status }),
  setRoundTimer: (timerOrFn) =>
    set((state) => ({
      roundTimer: typeof timerOrFn === "function" ? timerOrFn(state.roundTimer) : timerOrFn,
    })),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  setPaused: (isPaused) => set({ isPaused }),
  setRoundResult: (roundResult) => set({ roundResult }),
  incrementScoreP1: () => set((state) => ({ scoreP1: state.scoreP1 + 1 })),
  incrementScoreP2: () => set((state) => ({ scoreP2: state.scoreP2 + 1 })),
  resetGame: () =>
    set({
      status: "idle",
      roundTimer: DEFAULT_ROUND_TIME,
      isPaused: false,
      roundResult: null,
      scoreP1: 0,
      scoreP2: 0,
    }),
}));
