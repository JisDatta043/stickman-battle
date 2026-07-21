export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed confusing characters like O, 0, I, 1
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function validateRoomCode(code: string): { valid: boolean; error?: string } {
  const trimmed = code.trim().toUpperCase();
  if (trimmed.length !== 6) {
    return { valid: false, error: "Room code must be exactly 6 characters." };
  }
  if (!/^[A-Z0-9]{6}$/.test(trimmed)) {
    return { valid: false, error: "Room code contains invalid characters." };
  }
  return { valid: true };
}
