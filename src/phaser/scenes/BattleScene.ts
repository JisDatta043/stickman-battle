import * as Phaser from "phaser";
import { Stickman } from "../objects/Stickman";
import { Arena } from "../objects/Arena";
import { BotAI } from "../objects/BotAI";
import { Hitbox } from "../objects/Hitbox";
import { SoundManager } from "../audio/SoundManager";
import { useGameStore } from "@/stores/useGameStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { socketService } from "@/services/socketService";
import { useRoomStore } from "@/stores/useRoomStore";
import { UIScene } from "./UIScene";
import { GAME_WIDTH } from "@/utils/constants";

export class BattleScene extends Phaser.Scene {
  public player1!: Stickman;
  public player2!: Stickman;
  public arena!: Arena;
  public botAI?: BotAI;

  private emitter?: Phaser.GameObjects.Particles.ParticleEmitter;
  private isRoundOver: boolean = false;

  constructor() {
    super({ key: "BattleScene" });
  }

  public restartRound() {
    this.isRoundOver = false;

    // Reset store health points & game status
    usePlayerStore.getState().resetPlayers();
    useGameStore.getState().setRoundResult(null);
    useGameStore.getState().setGameStatus("playing");

    if (this.player1) {
      this.player1.reset(320, 500, "right");
    }

    if (this.player2) {
      this.player2.reset(GAME_WIDTH - 320, 500, "left");
    }

    if (this.botAI) {
      this.botAI.reset();
    }

    const uiScene = this.scene.get("UIScene") as UIScene;
    if (uiScene && typeof uiScene.startRoundTimer === "function") {
      uiScene.startRoundTimer();
    }
  }

  create() {
    this.isRoundOver = false;

    // Reset store health points & game status
    usePlayerStore.getState().resetPlayers();
    useGameStore.getState().setRoundResult(null);
    useGameStore.getState().setGameStatus("playing");

    // Initialize Arena & Physics Colliders
    this.arena = new Arena(this);

    const p1Name = usePlayerStore.getState().p1Name;
    const p1Color = usePlayerStore.getState().p1Color;
    const p2Name = usePlayerStore.getState().p2Name;
    const p2Color = usePlayerStore.getState().p2Color;

    // Spawn Player 1 (Left side)
    this.player1 = new Stickman(this, 320, 500, "p1", p1Name, p1Color, "right");

    // Spawn Player 2 / Bot (Right side)
    this.player2 = new Stickman(this, GAME_WIDTH - 320, 500, "p2", p2Name, p2Color, "left");

    // Enable Platform Collisions
    this.physics.add.collider(this.player1, this.arena.platforms);
    this.physics.add.collider(this.player2, this.arena.platforms);

    // Setup Bot AI if mode is 'bot'
    const gameMode = useGameStore.getState().mode;
    if (gameMode === "bot") {
      this.botAI = new BotAI(this.player2, this.player1);
    }

    // Hitbox Overlaps for Attacks
    this.setupHitboxOverlaps();

    // Setup Particle Emitter for Damage Spark Effects
    this.emitter = this.add.particles(0, 0, "spark", {
      speed: { min: 80, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      lifespan: 300,
      gravityY: 400,
      emitting: false,
    });

    // Listen to Socket Network Events if in PvP mode
    this.setupSocketEvents();
  }

  private setupHitboxOverlaps() {
    // Player 1 attacks Player 2
    this.physics.add.overlap(this.player1.punchHitbox, this.player2, (hitboxObj) => {
      this.handleHit(hitboxObj as Hitbox, this.player1, this.player2);
    });
    this.physics.add.overlap(this.player1.kickHitbox, this.player2, (hitboxObj) => {
      this.handleHit(hitboxObj as Hitbox, this.player1, this.player2);
    });

    // Player 2 attacks Player 1
    this.physics.add.overlap(this.player2.punchHitbox, this.player1, (hitboxObj) => {
      this.handleHit(hitboxObj as Hitbox, this.player2, this.player1);
    });
    this.physics.add.overlap(this.player2.kickHitbox, this.player1, (hitboxObj) => {
      this.handleHit(hitboxObj as Hitbox, this.player2, this.player1);
    });
  }

  private handleHit(hitbox: Hitbox, attacker: Stickman, victim: Stickman) {
    const body = hitbox.body as Phaser.Physics.Arcade.Body | null;
    if (!body || !body.enable || victim.hp <= 0) return;

    // Deactivate hitbox to prevent multi-hits in single frame
    hitbox.deactivate();

    // Apply damage and knockback
    victim.takeDamage(hitbox.damage, hitbox.knockback);

    // Trigger Spark Particle Burst at victim location
    if (this.emitter) {
      this.emitter.explode(12, victim.x, victim.y - 10);
    }

    // Sync state with Zustand stores
    if (victim.id === "p1") {
      usePlayerStore.getState().setP1Hp(victim.hp);
    } else {
      usePlayerStore.getState().setP2Hp(victim.hp);
    }

    // Emit socket event if online match
    const roomCode = useRoomStore.getState().roomCode;
    if (roomCode) {
      const socket = socketService.getSocket();
      socket?.emit("player-hit", {
        roomCode,
        targetId: victim.id,
        damage: hitbox.damage,
      });
    }

    // Check Death / Round Over
    if (victim.hp <= 0 && !this.isRoundOver) {
      this.handleKnockout(attacker);
    }
  }

  private handleKnockout(winner: Stickman) {
    this.isRoundOver = true;
    SoundManager.playVictory();

    if (winner.id === "p1") {
      useGameStore.getState().incrementScoreP1();
    } else {
      useGameStore.getState().incrementScoreP2();
    }

    useGameStore.getState().setRoundResult({
      winnerId: winner.id,
      winnerName: winner.fighterName,
      reason: "knockout",
      scores: {
        p1: useGameStore.getState().scoreP1,
        p2: useGameStore.getState().scoreP2,
      },
    });

    useGameStore.getState().setGameStatus("roundOver");
  }

  private setupSocketEvents() {
    const socket = socketService.getSocket();
    if (!socket || useRoomStore.getState().roomCode === null || socketService.isFallback()) return;

    // Clean up any existing listeners first to prevent duplicates
    socket.off("state-update");
    socket.off("player-hit");
    socket.off("health-update");
    socket.off("round-over");
    socket.off("match-over");
    socket.off("game-start");

    // Tell the server we are ready in the battle arena
    socket.emit("ready");

    socket.on("game-start", (data: any) => {
      console.log("[Phaser] game-start received:", data);
      useGameStore.getState().setGameStatus("playing");
    });

    socket.on("state-update", (data: any) => {
      const localIndex = useRoomStore.getState().localPlayerIndex;
      const playersList = Object.values(data.gameState?.players || {}) as any[];

      const serverLocalPlayer = playersList.find((p: any) => p.playerIndex === localIndex);
      const serverOpponentPlayer = playersList.find((p: any) => p.playerIndex !== localIndex);

      if (serverLocalPlayer) {
        if (localIndex === 1) {
          this.player1.hp = serverLocalPlayer.health;
          usePlayerStore.getState().setP1Hp(serverLocalPlayer.health);
        } else {
          this.player2.hp = serverLocalPlayer.health;
          usePlayerStore.getState().setP2Hp(serverLocalPlayer.health);
        }
      }

      if (serverOpponentPlayer) {
        const opponentEntity = localIndex === 1 ? this.player2 : this.player1;
        if (opponentEntity) {
          opponentEntity.setPosition(serverOpponentPlayer.position.x, serverOpponentPlayer.position.y);
          opponentEntity.setFacingDirection(serverOpponentPlayer.direction);
          opponentEntity.hp = serverOpponentPlayer.health;

          if (serverOpponentPlayer.isAttacking) {
            opponentEntity.punch(); // Trigger visual attack
          }

          if (localIndex === 1) {
            usePlayerStore.getState().setP2Hp(serverOpponentPlayer.health);
          } else {
            usePlayerStore.getState().setP1Hp(serverOpponentPlayer.health);
          }
        }
      }

      if (data.gameState?.roundTimer !== undefined) {
        useGameStore.getState().setRoundTimer(data.gameState.roundTimer);
      }
    });

    socket.on("player-hit", (data: any) => {
      const victimEntity = data.victimId === useRoomStore.getState().localPlayerId
        ? (useRoomStore.getState().localPlayerIndex === 1 ? this.player1 : this.player2)
        : (useRoomStore.getState().localPlayerIndex === 1 ? this.player2 : this.player1);

      if (victimEntity && this.emitter) {
        this.emitter.explode(12, data.position.x, data.position.y);
        SoundManager.playHurt();
      }
    });

    socket.on("health-update", (data: any) => {
      const isLocal = data.playerId === useRoomStore.getState().localPlayerId;
      const localIndex = useRoomStore.getState().localPlayerIndex;

      if (isLocal) {
        if (localIndex === 1) {
          this.player1.hp = data.health;
          usePlayerStore.getState().setP1Hp(data.health);
        } else {
          this.player2.hp = data.health;
          usePlayerStore.getState().setP2Hp(data.health);
        }
      } else {
        if (localIndex === 1) {
          this.player2.hp = data.health;
          usePlayerStore.getState().setP2Hp(data.health);
        } else {
          this.player1.hp = data.health;
          usePlayerStore.getState().setP1Hp(data.health);
        }
      }
    });

    socket.on("round-over", (data: any) => {
      const localId = useRoomStore.getState().localPlayerId;
      const localIndex = useRoomStore.getState().localPlayerIndex;
      const winnerName = data.winnerId
        ? (data.winnerId === localId
            ? usePlayerStore.getState().p1Name
            : usePlayerStore.getState().p2Name)
        : "Tie";

      let p1Score = 0;
      let p2Score = 0;

      for (const [pid, score] of Object.entries(data.scores || {})) {
        if (pid === localId) {
          if (localIndex === 1) p1Score = score as number;
          else p2Score = score as number;
        } else {
          if (localIndex === 1) p2Score = score as number;
          else p1Score = score as number;
        }
      }

      useGameStore.getState().setRoundResult({
        winnerId: data.winnerId,
        winnerName: winnerName,
        reason: "knockout",
        scores: { p1: p1Score, p2: p2Score },
      });

      useGameStore.getState().setGameStatus("roundOver");
    });

    // Clean up when scene is shut down or destroyed
    this.events.once("shutdown", () => {
      socket.off("state-update");
      socket.off("player-hit");
      socket.off("health-update");
      socket.off("round-over");
      socket.off("match-over");
      socket.off("game-start");
    });
  }

  update(time: number, delta: number) {
    const isPaused = useGameStore.getState().isPaused;
    const isOver = useGameStore.getState().status === "roundOver";

    if (isPaused || isOver) return;

    // Update Stickmen
    this.player1.update(time, delta);
    this.player2.update(time, delta);

    // Update Bot AI in single player mode
    if (this.botAI) {
      this.botAI.update(time, delta);
    }
  }
}
