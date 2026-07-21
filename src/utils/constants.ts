export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const DEFAULT_ROUND_TIME = 60; // seconds
export const MAX_HP = 100;

export const PUNCH_DAMAGE = 10;
export const KICK_DAMAGE = 18;

export const PUNCH_KNOCKBACK = { x: 180, y: -120 };
export const KICK_KNOCKBACK = { x: 320, y: -220 };

export const PUNCH_COOLDOWN = 300; // ms
export const KICK_COOLDOWN = 550; // ms

export const DEFAULT_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

export const COLOR_P1 = "#3b82f6"; // Blue
export const COLOR_P2 = "#ef4444"; // Red
export const COLOR_NEON = "#00f0ff"; // Cyan neon glow

export const KEYBINDINGS = {
  MOVE_LEFT: ["KeyA", "ArrowLeft"],
  MOVE_RIGHT: ["KeyD", "ArrowRight"],
  JUMP: ["KeyW", "ArrowUp", "Space"],
  PUNCH: ["KeyJ", "KeyZ"],
  KICK: ["KeyK", "KeyX"],
};
