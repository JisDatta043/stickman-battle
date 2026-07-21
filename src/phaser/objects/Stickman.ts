import * as Phaser from "phaser";
import { FighterState } from "@/types/game";
import { Hitbox } from "./Hitbox";
import { SoundManager } from "../audio/SoundManager";
import { PUNCH_DAMAGE, KICK_DAMAGE, PUNCH_KNOCKBACK, KICK_KNOCKBACK, PUNCH_COOLDOWN, KICK_COOLDOWN } from "@/utils/constants";

export class Stickman extends Phaser.GameObjects.Container {
  public id: string;
  public fighterName: string;
  public colorHex: number;
  public colorStr: string;
  public hp: number = 100;
  public maxHp: number = 100;

  public fighterState: FighterState = "idle";
  public facing: "left" | "right" = "right";

  // Physics body
  public declare body: Phaser.Physics.Arcade.Body;

  // Graphics container for procedural skeletal stickman drawing
  private graphics: Phaser.GameObjects.Graphics;

  // Attack Hitboxes
  public punchHitbox: Hitbox;
  public kickHitbox: Hitbox;

  // Attack cooldown timers
  private lastAttackTime: number = 0;
  private attackDurationTimer: number = 0;
  private isAttackingState: boolean = false;

  // Animation frame tracker
  private animTimer: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, id: string, name: string, color: string, startFacing: "left" | "right" = "right") {
    super(scene, x, y);

    this.id = id;
    this.fighterName = name;
    this.colorStr = color;
    this.colorHex = parseInt(color.replace("#", "0x"), 16) || 0x3b82f6;
    this.facing = startFacing;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Setup Arcade Physics Body dimensions
    this.body.setSize(36, 90);
    this.body.setOffset(-18, -45);
    this.body.setCollideWorldBounds(true);
    this.body.setBounce(0.05);

    // Create Graphics child
    this.graphics = scene.add.graphics();
    this.add(this.graphics);

    // Create Hitboxes
    this.punchHitbox = new Hitbox(scene, x, y, 48, 30);
    this.kickHitbox = new Hitbox(scene, x, y, 64, 40);
    this.punchHitbox.deactivate();
    this.kickHitbox.deactivate();
  }

  public update(time: number, delta: number) {
    this.animTimer += delta * 0.008;

    // Synchronize Hitbox positions relative to stickman facing direction
    const offsetX = this.facing === "right" ? 35 : -35;
    this.punchHitbox.setPosition(this.x + offsetX, this.y - 10);
    this.kickHitbox.setPosition(this.x + offsetX * 1.2, this.y + 5);

    // Handle Attack Duration Timeout
    if (this.isAttackingState) {
      this.attackDurationTimer -= delta;
      if (this.attackDurationTimer <= 0) {
        this.isAttackingState = false;
        this.punchHitbox.deactivate();
        this.kickHitbox.deactivate();
        if (this.fighterState !== "dead" && this.fighterState !== "knockback") {
          this.fighterState = "idle";
        }
      }
    }

    // Determine physics-based state if not performing overriding actions
    if (!this.isAttackingState && this.fighterState !== "knockback" && this.fighterState !== "dead" && this.fighterState !== "takeDamage") {
      if (!this.body.blocked.down) {
        this.fighterState = this.body.velocity.y < 0 ? "jump" : "fall";
      } else if (Math.abs(this.body.velocity.x) > 10) {
        this.fighterState = "run";
      } else {
        this.fighterState = "idle";
      }
    }

    // Render Procedural Skeleton
    this.drawStickman();
  }

  public punch(): boolean {
    const now = Date.now();
    if (this.isAttackingState || now - this.lastAttackTime < PUNCH_COOLDOWN || this.fighterState === "dead") {
      return false;
    }

    this.isAttackingState = true;
    this.lastAttackTime = now;
    this.attackDurationTimer = 220; // 220ms punch animation duration
    this.fighterState = "punch";

    const kx = this.facing === "right" ? PUNCH_KNOCKBACK.x : -PUNCH_KNOCKBACK.x;
    this.punchHitbox.activate(this.id, PUNCH_DAMAGE, { x: kx, y: PUNCH_KNOCKBACK.y });
    SoundManager.playPunch();
    return true;
  }

  public kick(): boolean {
    const now = Date.now();
    if (this.isAttackingState || now - this.lastAttackTime < KICK_COOLDOWN || this.fighterState === "dead") {
      return false;
    }

    this.isAttackingState = true;
    this.lastAttackTime = now;
    this.attackDurationTimer = 340; // 340ms kick animation duration
    this.fighterState = "kick";

    const kx = this.facing === "right" ? KICK_KNOCKBACK.x : -KICK_KNOCKBACK.x;
    this.kickHitbox.activate(this.id, KICK_DAMAGE, { x: kx, y: KICK_KNOCKBACK.y });
    SoundManager.playKick();
    return true;
  }

  public takeDamage(damage: number, knockback: { x: number; y: number }) {
    if (this.fighterState === "dead") return;

    this.hp = Math.max(0, this.hp - damage);
    SoundManager.playHurt();

    // Apply physics impulse knockback
    this.body.setVelocity(knockback.x, knockback.y);

    if (this.hp <= 0) {
      this.fighterState = "dead";
      this.isAttackingState = false;
      this.punchHitbox.deactivate();
      this.kickHitbox.deactivate();
    } else {
      this.fighterState = "takeDamage";
      this.scene.time.delayedCall(280, () => {
        if (this.fighterState === "takeDamage") {
          this.fighterState = "idle";
        }
      });
    }
  }

  public setFacingDirection(dir: "left" | "right") {
    this.facing = dir;
  }

  /**
   * Procedural Stickman Kinematic Rendering
   */
  private drawStickman() {
    this.graphics.clear();

    const isRight = this.facing === "right";
    const dir = isRight ? 1 : -1;

    // Dynamic stroke styling
    const lineThickness = 5;
    let strokeColor = this.colorHex;

    if (this.fighterState === "takeDamage") {
      strokeColor = 0xffffff; // Damage flash white
    }

    this.graphics.lineStyle(lineThickness, strokeColor, 1);
    this.graphics.fillStyle(strokeColor, 1);

    // Root joint origins
    const headY = -35;
    const neckY = -22;

    let headX = 0;
    let torsoTilt = 0;

    // Joint Angle Calculations based on animation state
    let leftArmAngle = 0;
    let rightArmAngle = 0;
    let leftLegAngle = 0;
    let rightLegAngle = 0;

    const t = this.animTimer;

    switch (this.fighterState) {
      case "idle":
        headX = 0;
        torsoTilt = 0;
        leftArmAngle = Math.sin(t * 2) * 0.15 + 0.3;
        rightArmAngle = -Math.sin(t * 2) * 0.15 - 0.3;
        leftLegAngle = 0.2;
        rightLegAngle = -0.2;
        break;

      case "run":
        torsoTilt = 0.2 * dir;
        leftArmAngle = Math.sin(t * 8) * 0.8;
        rightArmAngle = -Math.sin(t * 8) * 0.8;
        leftLegAngle = -Math.sin(t * 8) * 0.7;
        rightLegAngle = Math.sin(t * 8) * 0.7;
        break;

      case "jump":
        torsoTilt = -0.1 * dir;
        leftArmAngle = -1.2;
        rightArmAngle = -1.2;
        leftLegAngle = 0.5;
        rightLegAngle = -0.4;
        break;

      case "fall":
        torsoTilt = 0.1 * dir;
        leftArmAngle = -0.8;
        rightArmAngle = -0.8;
        leftLegAngle = -0.3;
        rightLegAngle = 0.3;
        break;

      case "punch":
        torsoTilt = 0.35 * dir;
        rightArmAngle = 1.4 * dir; // Extended punch arm
        leftArmAngle = -0.4 * dir; // Guard arm
        leftLegAngle = -0.3;
        rightLegAngle = 0.4;
        break;

      case "kick":
        torsoTilt = -0.4 * dir;
        rightLegAngle = 1.5 * dir; // Extended kick leg
        leftLegAngle = -0.2 * dir;
        leftArmAngle = -0.7;
        rightArmAngle = -0.7;
        break;

      case "takeDamage":
        torsoTilt = -0.4 * dir;
        headX = -8 * dir;
        leftArmAngle = -1.0;
        rightArmAngle = -1.0;
        leftLegAngle = -0.4;
        rightLegAngle = 0.2;
        break;

      case "dead":
        torsoTilt = 1.3 * dir;
        headX = 25 * dir;
        leftArmAngle = 1.2;
        rightArmAngle = 0.8;
        leftLegAngle = 1.0;
        rightLegAngle = 1.2;
        break;
    }

    // Draw Head Circle (radius 12)
    this.graphics.strokeCircle(headX, headY, 12);
    this.graphics.fillCircle(headX, headY, 10);

    // Spine Line (Neck to Hip)
    const hipX = headX - Math.sin(torsoTilt) * 32;
    const finalHipY = neckY + Math.cos(torsoTilt) * 32;
    this.graphics.lineBetween(headX, neckY, hipX, finalHipY);

    // Shoulder joint origin
    const shoulderX = headX - Math.sin(torsoTilt) * 8;
    const shoulderY = neckY + Math.cos(torsoTilt) * 8;

    // Draw Left Arm (Upper & Lower)
    const elbowLeftX = shoulderX + Math.sin(leftArmAngle) * 16;
    const elbowLeftY = shoulderY + Math.cos(leftArmAngle) * 16;
    const handLeftX = elbowLeftX + Math.sin(leftArmAngle + 0.3) * 16;
    const handLeftY = elbowLeftY + Math.cos(leftArmAngle + 0.3) * 16;
    this.graphics.lineBetween(shoulderX, shoulderY, elbowLeftX, elbowLeftY);
    this.graphics.lineBetween(elbowLeftX, elbowLeftY, handLeftX, handLeftY);

    // Draw Right Arm (Upper & Lower)
    const elbowRightX = shoulderX + Math.sin(rightArmAngle) * 16;
    const elbowRightY = shoulderY + Math.cos(rightArmAngle) * 16;
    const handRightX = elbowRightX + Math.sin(rightArmAngle - 0.3) * 16;
    const handRightY = elbowRightY + Math.cos(rightArmAngle - 0.3) * 16;
    this.graphics.lineBetween(shoulderX, shoulderY, elbowRightX, elbowRightY);
    this.graphics.lineBetween(elbowRightX, elbowRightY, handRightX, handRightY);

    // Draw Left Leg (Upper & Lower)
    const kneeLeftX = hipX + Math.sin(leftLegAngle) * 20;
    const kneeLeftY = finalHipY + Math.cos(leftLegAngle) * 20;
    const footLeftX = kneeLeftX + Math.sin(leftLegAngle - 0.1) * 20;
    const footLeftY = kneeLeftY + Math.cos(leftLegAngle - 0.1) * 20;
    this.graphics.lineBetween(hipX, finalHipY, kneeLeftX, kneeLeftY);
    this.graphics.lineBetween(kneeLeftX, kneeLeftY, footLeftX, footLeftY);

    // Draw Right Leg (Upper & Lower)
    const kneeRightX = hipX + Math.sin(rightLegAngle) * 20;
    const kneeRightY = finalHipY + Math.cos(rightLegAngle) * 20;
    const footRightX = kneeRightX + Math.sin(rightLegAngle + 0.1) * 20;
    const footRightY = kneeRightY + Math.cos(rightLegAngle + 0.1) * 20;
    this.graphics.lineBetween(hipX, finalHipY, kneeRightX, kneeRightY);
    this.graphics.lineBetween(kneeRightX, kneeRightY, footRightX, footRightY);
  }
}
