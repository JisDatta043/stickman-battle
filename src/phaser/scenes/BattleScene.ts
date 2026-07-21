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

  create() {
    this.isRoundOver = false;

    // Reset store health points & game status
    usePlayerStore.getState().resetPlayers();
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
    if (!socket) return;

    socket.on("player-state-update", (data) => {
      if (data.id === "p2" && this.player2) {
        this.player2.setPosition(data.position.x, data.position.y);
        this.player2.setFacingDirection(data.facing);
        this.player2.hp = data.hp;
        usePlayerStore.getState().setP2Hp(data.hp);
      }
    });

    socket.on("player-attacked", (data) => {
      if (data.playerId === "p2" && this.player2) {
        if (data.attackType === "punch") {
          this.player2.punch();
        } else {
          this.player2.kick();
        }
      }
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
