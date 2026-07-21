import { FighterState, Vector2D } from "./game";

export interface PlayerProfile {
  id: string;
  name: string;
  color: string;
  isReady: boolean;
  isHost: boolean;
  score: number;
}

export interface PlayerInput {
  left: boolean;
  right: boolean;
  jump: boolean;
  punch: boolean;
  kick: boolean;
  timestamp: number;
}

export interface PlayerSyncData {
  id: string;
  position: Vector2D;
  velocity: Vector2D;
  facing: "left" | "right";
  state: FighterState;
  hp: number;
  isGrounded: boolean;
}
