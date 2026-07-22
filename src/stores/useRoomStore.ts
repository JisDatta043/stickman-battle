import { create } from "zustand";
import { RoomState, RoomError } from "@/types/room";

interface RoomStoreState {
  roomCode: string | null;
  isHost: boolean;
  room: RoomState | null;
  error: RoomError | null;
  isJoining: boolean;
  isCreating: boolean;
  localPlayerIndex: number | null;
  localPlayerId: string | null;

  // Actions
  setRoomCode: (code: string | null) => void;
  setIsHost: (isHost: boolean) => void;
  setRoom: (room: RoomState | null) => void;
  setError: (error: RoomError | null) => void;
  setIsJoining: (isJoining: boolean) => void;
  setIsCreating: (isCreating: boolean) => void;
  setLocalPlayerInfo: (index: number | null, id: string | null) => void;
  clearRoom: () => void;
}

export const useRoomStore = create<RoomStoreState>((set) => ({
  roomCode: null,
  isHost: false,
  room: null,
  error: null,
  isJoining: false,
  isCreating: false,
  localPlayerIndex: null,
  localPlayerId: null,

  setRoomCode: (roomCode) => set({ roomCode }),
  setIsHost: (isHost) => set({ isHost }),
  setRoom: (room) => set({ room }),
  setError: (error) => set({ error }),
  setIsJoining: (isJoining) => set({ isJoining }),
  setIsCreating: (isCreating) => set({ isCreating }),
  setLocalPlayerInfo: (localPlayerIndex, localPlayerId) => set({ localPlayerIndex, localPlayerId }),
  clearRoom: () =>
    set({
      roomCode: null,
      isHost: false,
      room: null,
      error: null,
      isJoining: false,
      isCreating: false,
      localPlayerIndex: null,
      localPlayerId: null,
    }),
}));
