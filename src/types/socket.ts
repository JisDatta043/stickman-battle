import { PlayerSyncData, PlayerInput } from "./player";
import { RoomState, RoomError } from "./room";
import { RoundResult } from "./game";

export interface ServerToClientEvents {
  "room-created": (data: { roomId: string; roomCode: string; playerId: string; reconnectToken: string; playerIndex: number; gameState: any }) => void;
  "room-joined": (data: { roomId: string; roomCode: string; playerId: string; reconnectToken: string; playerIndex: number; gameState: any }) => void;
  "room-full": (data: { message: string }) => void;
  "room-not-found": (data: { message: string }) => void;
  "room-error": (data: { code: string; message: string }) => void;
  "player-joined": (data: { playerId: string; nickname: string; playerIndex: number; ready: boolean }) => void;
  "player-left": (data: { playerId: string; nickname: string; reason?: string }) => void;
  "game-start": (data: { gameState: any }) => void;
  "state-update": (data: { gameState: any }) => void;
  "player-hit": (data: { attackerId: string; victimId: string; damage: number; remainingHealth: number; position: { x: number; y: number } }) => void;
  "health-update": (data: { playerId: string; health: number; maxHealth: number }) => void;
  "round-over": (data: { winnerId: string | null; round: number; scores: Record<string, number> }) => void;
  "match-over": (data: { winnerId: string; scores: Record<string, number> }) => void;
  "pong": (data: { clientTimestamp: number; serverTimestamp: number; latency: number }) => void;
  "error": (data: { code: string; message: string }) => void;

  // Keep old types for typescript backward-compatibility where necessary
  "player-state-update"?: (data: PlayerSyncData) => void;
  "player-attacked"?: (data: { playerId: string; attackType: "punch" | "kick" }) => void;
  "player-damaged"?: (data: { playerId: string; damage: number; newHp: number; attackerId: string }) => void;
  "round-end"?: (result: RoundResult) => void;
}

export interface ClientToServerEvents {
  "create-room": (payload: { nickname: string; mode?: "pvp" | "bot" }) => void;
  "join-room": (payload: { roomCode: string; nickname: string }) => void;
  "reconnect-player": (payload: { roomId: string; reconnectToken: string; nickname: string }) => void;
  "leave-room": () => void;
  "move": (payload: { direction: -1 | 0 | 1 }) => void;
  "jump": () => void;
  "attack": () => void;
  "ready": () => void;
  "pause": () => void;
  "resume": () => void;
  "ping": (payload: { clientTimestamp: number }) => void;

  // Keep old ones for typescript compatibility
  "player-ready"?: (data: { roomCode: string }) => void;
  "player-move"?: (data: { roomCode: string; input: PlayerInput; position: { x: number; y: number } }) => void;
  "player-jump"?: (data: { roomCode: string }) => void;
  "player-attack"?: (data: { roomCode: string; attackType: "punch" | "kick" }) => void;
  "player-hit"?: (data: { roomCode: string; targetId: string; damage: number }) => void;
  "round-end"?: (data: { roomCode: string; winnerId: string }) => void;
}
