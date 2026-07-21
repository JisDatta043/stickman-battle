import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "@/types/socket";
import { useSocketStore } from "@/stores/useSocketStore";
import { DEFAULT_SERVER_URL } from "@/utils/constants";

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

    this.socket.on("pong", (data: { clientTimestamp?: number; serverTimestamp?: number; latency?: number } | number) => {
      const latency = typeof data === "number" ? data : (data?.latency ?? 0);
      useSocketStore.getState().setLatency(latency);
    });
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
