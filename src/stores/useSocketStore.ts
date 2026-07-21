import { create } from "zustand";

interface SocketState {
  isConnected: boolean;
  isConnecting: boolean;
  isFallback: boolean;
  latency: number;
  socketId: string | null;
  error: string | null;

  // Actions
  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setIsFallback: (isFallback: boolean) => void;
  setLatency: (latency: number) => void;
  setSocketId: (id: string | null) => void;
  setError: (error: string | null) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  isConnected: false,
  isConnecting: false,
  isFallback: false,
  latency: 0,
  socketId: null,
  error: null,

  setConnected: (isConnected) => set({ isConnected, isConnecting: false }),
  setConnecting: (isConnecting) => set({ isConnecting }),
  setIsFallback: (isFallback) => set({ isFallback }),
  setLatency: (latency) => set({ latency }),
  setSocketId: (socketId) => set({ socketId }),
  setError: (error) => set({ error }),
}));
