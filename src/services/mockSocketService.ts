import { generateRoomCode } from "@/utils/roomCode";
import { RoomState } from "@/types/room";

class MockSocketService {
  private activeRooms: Map<string, RoomState> = new Map();

  public createRoom(playerName: string): { roomCode: string; room: RoomState } {
    const roomCode = generateRoomCode();
    const room: RoomState = {
      code: roomCode,
      status: "waiting",
      players: [
        {
          id: "host-" + Math.random().toString(36).substring(2, 9),
          name: playerName || "Player 1",
          color: "#3b82f6",
          isReady: true,
          isHost: true,
          score: 0,
        },
      ],
      maxPlayers: 2,
      createdAt: Date.now(),
    };

    this.activeRooms.set(roomCode, room);
    return { roomCode, room };
  }

  public joinRoom(roomCode: string, playerName: string): { success: boolean; room?: RoomState; errorType?: string; errorMessage?: string } {
    const code = roomCode.trim().toUpperCase();
    const room = this.activeRooms.get(code);

    if (!room) {
      return {
        success: false,
        errorType: "ROOM_NOT_FOUND",
        errorMessage: "Room code not found. Please check and try again.",
      };
    }

    if (room.players.length >= room.maxPlayers) {
      return {
        success: false,
        errorType: "ROOM_FULL",
        errorMessage: "Room is already full.",
      };
    }

    const newPlayer = {
      id: "guest-" + Math.random().toString(36).substring(2, 9),
      name: playerName || "Player 2",
      color: "#ef4444",
      isReady: true,
      isHost: false,
      score: 0,
    };

    room.players.push(newPlayer);
    room.status = "playing";

    return { success: true, room };
  }

  public getRoom(roomCode: string): RoomState | undefined {
    return this.activeRooms.get(roomCode.trim().toUpperCase());
  }

  public leaveRoom(roomCode: string, playerId: string) {
    const code = roomCode.trim().toUpperCase();
    const room = this.activeRooms.get(code);
    if (room) {
      room.players = room.players.filter((p) => p.id !== playerId);
      if (room.players.length === 0) {
        this.activeRooms.delete(code);
      } else {
        room.status = "waiting";
      }
    }
  }
}

export const mockSocketService = new MockSocketService();
