import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "@/types/socket";
import { useSocketStore } from "@/stores/useSocketStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { RoomState } from "@/types/room";
import { DEFAULT_SERVER_URL } from "@/utils/constants";

const mapGameStateToRoomState = (roomCode: string, gameState: any): RoomState => {
  const players = Object.values(gameState.players || {}).map((p: any) => ({
    id: p.id,
    name: p.nickname || p.name || "Player",
    color: p.playerIndex === 1 ? "#3b82f6" : "#ef4444",
    isReady: p.ready ?? true,
    isHost: p.playerIndex === 1,
    score: p.score || 0,
  }));

  return {
    code: roomCode,
    status: gameState.status === "waiting" ? "waiting" : (gameState.status === "playing" ? "playing" : "waiting"),
    players,
    maxPlayers: 2,
    createdAt: gameState.lastTick || Date.now(),
  };
};

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private isFallbackMode: boolean = false;

  public connect(url: string = DEFAULT_SERVER_URL) {
    if (this.socket && this.socket.connected) return;

    useSocketStore.getState().setConnecting(true);

    const isProduction =
      process.env.NODE_ENV === "production" ||
      (typeof window !== "undefined" &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1");
    const isLocalhostUrl = url.includes("localhost") || url.includes("127.0.0.1");

    if (isProduction && isLocalhostUrl) {
      console.warn(
        `[SocketService] Warning: Production mode detected, but NEXT_PUBLIC_SOCKET_URL is pointing to "${url}". Real-time multiplayer requires setting NEXT_PUBLIC_SOCKET_URL in Vercel Project Settings.`
      );
      useSocketStore.getState().setIsLocalhostInProduction(true);
    } else {
      useSocketStore.getState().setIsLocalhostInProduction(false);
    }

    try {
      this.socket = io(url, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
        timeout: 4000,
      });

      this.setupListeners();
    } catch (err) {
      console.warn("Socket connection error, enabling fallback mode:", err);
      this.enableFallback();
    }
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      useSocketStore.getState().setConnected(true);
      useSocketStore.getState().setSocketId(this.socket?.id || null);
      useSocketStore.getState().setError(null);
      useSocketStore.getState().setIsFallback(false);
      this.isFallbackMode = false;
      this.startPingInterval();
      if (this.socket) {
        this.socket.emit("ping", { clientTimestamp: Date.now() });
      }
    });

    this.socket.on("disconnect", (reason) => {
      useSocketStore.getState().setConnected(false);
      if (reason === "io server disconnect") {
        this.socket?.connect();
      }
    });

    this.socket.on("connect_error", (error) => {
      console.warn("Socket connect error:", error.message);
      useSocketStore.getState().setError("Failed to connect to multiplayer server. Using local room mode.");
      this.enableFallback();
    });

    this.socket.on("pong", (data: any) => {
      const latency = typeof data === "number" ? data : (data?.latency ?? 0);
      useSocketStore.getState().setLatency(latency);
    });

    // 1. Listen to room-created
    this.socket.on("room-created", (data) => {
      console.log("[Socket] room-created:", data);
      const roomState = mapGameStateToRoomState(data.roomCode, data.gameState);
      useRoomStore.getState().setRoomCode(data.roomCode);
      useRoomStore.getState().setIsHost(true);
      useRoomStore.getState().setRoom(roomState);
      useRoomStore.getState().setLocalPlayerInfo(data.playerIndex, data.playerId);
      useRoomStore.getState().setIsCreating(false);
      useRoomStore.getState().setError(null);
    });

    // 2. Listen to room-joined
    this.socket.on("room-joined", (data) => {
      console.log("[Socket] room-joined:", data);
      const roomState = mapGameStateToRoomState(data.roomCode, data.gameState);
      useRoomStore.getState().setRoomCode(data.roomCode);
      useRoomStore.getState().setIsHost(data.playerIndex === 1);
      useRoomStore.getState().setRoom(roomState);
      useRoomStore.getState().setLocalPlayerInfo(data.playerIndex, data.playerId);
      useRoomStore.getState().setIsJoining(false);
      useRoomStore.getState().setError(null);
    });

    // 3. Listen to player-joined
    this.socket.on("player-joined", (data) => {
      console.log("[Socket] player-joined:", data);
      const currentRoom = useRoomStore.getState().room;
      if (currentRoom) {
        const newPlayer = {
          id: data.playerId,
          name: data.nickname,
          color: data.playerIndex === 1 ? "#3b82f6" : "#ef4444",
          isReady: data.ready,
          isHost: data.playerIndex === 1,
          score: 0,
        };
        const playerExists = currentRoom.players.some((p) => p.id === data.playerId);
        const updatedPlayers = playerExists
          ? currentRoom.players.map((p) => (p.id === data.playerId ? newPlayer : p))
          : [...currentRoom.players, newPlayer];

        useRoomStore.getState().setRoom({
          ...currentRoom,
          players: updatedPlayers,
          status: updatedPlayers.length >= currentRoom.maxPlayers ? "full" : "waiting",
        });
      }
    });

    // 4. Listen to player-left
    this.socket.on("player-left", (data) => {
      console.log("[Socket] player-left:", data);
      const currentRoom = useRoomStore.getState().room;
      if (currentRoom) {
        const updatedPlayers = currentRoom.players.filter((p) => p.id !== data.playerId);
        useRoomStore.getState().setRoom({
          ...currentRoom,
          players: updatedPlayers,
          status: "waiting",
        });
      }
    });

    // 5. Handle room error / error / room-not-found / room-full
    const handleRoomError = (err: { code?: string; type?: string; message: string }) => {
      console.error("[Socket] room error:", err);
      useRoomStore.getState().setError({
        type: (err.code || err.type || "INVALID_CODE") as any,
        message: err.message,
      });
      useRoomStore.getState().setIsJoining(false);
      useRoomStore.getState().setIsCreating(false);
    };

    this.socket.on("room-error", (data) => handleRoomError(data));
    this.socket.on("error", (data) => handleRoomError(data));
    this.socket.on("room-not-found", (data) => handleRoomError({ code: "ROOM_NOT_FOUND", message: data.message }));
    this.socket.on("room-full", (data) => handleRoomError({ code: "ROOM_FULL", message: data.message }));
  }

  private enableFallback() {
    this.isFallbackMode = true;
    useSocketStore.getState().setIsFallback(true);
    useSocketStore.getState().setConnected(true);
    useSocketStore.getState().setConnecting(false);
    useSocketStore.getState().setSocketId("mock-socket-id");
  }

  private startPingInterval() {
    setInterval(() => {
      if (this.socket && this.socket.connected) {
        this.socket.emit("ping", { clientTimestamp: Date.now() });
      }
    }, 5000);
  }

  public getSocket() {
    return this.socket;
  }

  public isFallback() {
    return this.isFallbackMode;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      useSocketStore.getState().setConnected(false);
    }
  }
}

export const socketService = new SocketService();
