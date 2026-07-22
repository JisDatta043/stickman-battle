"use client";

import { useEffect } from "react";
import { socketService } from "@/services/socketService";
import { useSocketStore } from "@/stores/useSocketStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { mockSocketService } from "@/services/mockSocketService";
import { RoomErrorType } from "@/types/room";

export function useSocket() {
  const { isConnected, isConnecting, latency, error } = useSocketStore();
  const { setRoom, setError, setIsJoining, setIsCreating } = useRoomStore();

  useEffect(() => {
    socketService.connect();
    return () => {
      // Keep socket alive across views or disconnect on unmount
    };
  }, []);

  const createRoom = (playerName: string) => {
    setIsCreating(true);
    setError(null);

    const socket = socketService.getSocket();
    if (socket && socket.connected && !socketService.isFallback()) {
      socket.emit("create-room", { nickname: playerName });
    } else {
      // Fallback mock socket room generation
      setTimeout(() => {
        const result = mockSocketService.createRoom(playerName);
        useRoomStore.getState().setRoomCode(result.roomCode);
        useRoomStore.getState().setIsHost(true);
        useRoomStore.getState().setRoom(result.room);
        setIsCreating(false);
      }, 500);
    }
  };

  const joinRoom = (roomCode: string, playerName: string) => {
    setIsJoining(true);
    setError(null);

    const socket = socketService.getSocket();
    if (socket && socket.connected && !socketService.isFallback()) {
      socket.emit("join-room", { roomCode, nickname: playerName });
    } else {
      // Fallback mock socket room join
      setTimeout(() => {
        const result = mockSocketService.joinRoom(roomCode, playerName);
        if (result.success && result.room) {
          useRoomStore.getState().setRoomCode(roomCode);
          useRoomStore.getState().setIsHost(false);
          setRoom(result.room);
        } else {
          setError({
            type: (result.errorType as RoomErrorType) || "INVALID_CODE",
            message: result.errorMessage || "Failed to join room.",
          });
        }
        setIsJoining(false);
      }, 600);
    }
  };

  return {
    isConnected,
    isConnecting,
    latency,
    error,
    createRoom,
    joinRoom,
  };
}
