import { Stickman } from "./Stickman";

export class BotAI {
  private bot: Stickman;
  private target: Stickman;
  private updateTimer: number = 0;
  private attackCooldownTimer: number = 0;

  constructor(bot: Stickman, target: Stickman) {
    this.bot = bot;
    this.target = target;
  }

  public update(time: number, delta: number) {
    if (this.bot.hp <= 0 || this.target.hp <= 0) {
      this.bot.body.setVelocityX(0);
      return;
    }

    this.updateTimer += delta;
    this.attackCooldownTimer += delta;

    // Run decision cycle every 120ms
    if (this.updateTimer >= 120) {
      this.updateTimer = 0;
      this.makeDecision();
    }
  }

  private makeDecision() {
    const dx = this.target.x - this.bot.x;
    const dy = this.target.y - this.bot.y;
    const dist = Math.hypot(dx, dy);

    // Update facing direction
    if (dx > 10) {
      this.bot.setFacingDirection("right");
    } else if (dx < -10) {
      this.bot.setFacingDirection("left");
    }

    const moveSpeed = 220;

    // 1. Attack decision if close enough
    if (Math.abs(dx) < 70 && Math.abs(dy) < 40) {
      this.bot.body.setVelocityX(0);
      if (this.attackCooldownTimer > 600) {
        this.attackCooldownTimer = 0;
        // 40% chance of kick, 60% chance of punch
        if (Math.random() < 0.4) {
          this.bot.kick();
        } else {
          this.bot.punch();
        }
      }
      return;
    }

    // 2. Navigation / Movement decision
    if (dx > 30) {
      this.bot.body.setVelocityX(moveSpeed);
    } else if (dx < -30) {
      this.bot.body.setVelocityX(-moveSpeed);
    } else {
      this.bot.body.setVelocityX(0);
    }

    // 3. Jump decision (if target is higher up or bot hits a wall or platform edge)
    if (this.bot.body.blocked.down) {
      const targetIsAbove = dy < -60 && Math.abs(dx) < 160;
      const hitWall = this.bot.body.blocked.left || this.bot.body.blocked.right;

      if (targetIsAbove || hitWall || (Math.random() < 0.05 && dist < 300)) {
        this.bot.body.setVelocityY(-560);
      }
    }
  }
}
