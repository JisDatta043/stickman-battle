import { PlayerProfile } from "./player";

export type RoomStatus = "waiting" | "full" | "playing" | "closed";

export interface RoomState {
  code: string;
  status: RoomStatus;
  players: PlayerProfile[];
  maxPlayers: number;
  createdAt: number;
}

export type RoomErrorType = 
  | "ROOM_NOT_FOUND" 
  | "ROOM_FULL" 
  | "INVALID_CODE" 
  | "DISCONNECTED" 
  | "PLAYER_LEFT";

export interface RoomError {
  type: RoomErrorType;
  message: string;
}
