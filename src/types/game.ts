export type GameMode = "bot" | "pvp";

export type GameStatus = "idle" | "waiting" | "ready" | "playing" | "paused" | "roundOver";

export type FighterState = 
  | "idle" 
  | "run" 
  | "jump" 
  | "fall" 
  | "punch" 
  | "kick" 
  | "takeDamage" 
  | "knockback" 
  | "dead";

export type AttackType = "punch" | "kick";

export interface Vector2D {
  x: number;
  y: number;
}

export interface PlayerStats {
  id: string;
  name: string;
  color: string; // e.g. '#3b82f6' for P1, '#ef4444' for P2
  hp: number;
  maxHp: number;
  score: number;
  state: FighterState;
  position: Vector2D;
  velocity: Vector2D;
  facing: "left" | "right";
  isGrounded: boolean;
  isAttacking: boolean;
  currentAttack?: AttackType;
  isHit: boolean;
}

export interface RoundResult {
  winnerId: string | null;
  winnerName: string;
  reason: "knockout" | "timeup";
  scores: {
    p1: number;
    p2: number;
  };
}
