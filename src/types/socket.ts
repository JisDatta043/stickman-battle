import { PlayerSyncData, PlayerInput } from "./player";
import { RoomState, RoomError } from "./room";
import { RoundResult } from "./game";

export interface ServerToClientEvents {
  "room-created": (data: { roomCode: string; room: RoomState }) => void;
  "room-joined": (data: { roomCode: string; room: RoomState }) => void;
  "player-joined": (data: { player: { id: string; name: string } }) => void;
  "player-left": (data: { playerId: string }) => void;
  "game-start": (data: { room: RoomState }) => void;
  "player-state-update": (data: PlayerSyncData) => void;
  "player-attacked": (data: { playerId: string; attackType: "punch" | "kick" }) => void;
  "player-damaged": (data: { playerId: string; damage: number; newHp: number; attackerId: string }) => void;
  "health-update": (data: { p1Hp: number; p2Hp: number }) => void;
  "round-end": (result: RoundResult) => void;
  "room-error": (error: RoomError) => void;
  "pong": (data: { clientTimestamp?: number; serverTimestamp?: number; latency?: number } | number) => void;
}

export interface ClientToServerEvents {
  "create-room": (data: { playerName: string; nickname?: string }) => void;
  "join-room": (data: { roomCode: string; playerName: string; nickname?: string }) => void;
  "player-ready": (data: { roomCode: string }) => void;
  "player-move": (data: { roomCode: string; input: PlayerInput; position: { x: number; y: number } }) => void;
  "player-jump": (data: { roomCode: string }) => void;
  "player-attack": (data: { roomCode: string; attackType: "punch" | "kick" }) => void;
  "player-hit": (data: { roomCode: string; targetId: string; damage: number }) => void;
  "health-update": (data: { roomCode: string; p1Hp: number; p2Hp: number }) => void;
  "round-end": (data: { roomCode: string; winnerId: string }) => void;
  "leave-room": (data: { roomCode: string }) => void;
  "ping": (payload?: { clientTimestamp: number }) => void;
}
