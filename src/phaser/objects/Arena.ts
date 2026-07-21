import * as Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "@/utils/constants";

export class Arena {
  public scene: Phaser.Scene;
  public platforms: Phaser.Physics.Arcade.StaticGroup;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.platforms = scene.physics.add.staticGroup();
    this.createBackground();
    this.createPlatforms();
  }

  private createBackground() {
    const graphics = this.scene.add.graphics();

    // Dark sleek background gradient fill
    graphics.fillGradientStyle(0x0a0c14, 0x0a0c14, 0x121829, 0x121829, 1);
    graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Cyan grid lines accent
    graphics.lineStyle(1, 0x00f0ff, 0.05);
    const gridSize = 40;
    for (let x = 0; x < GAME_WIDTH; x += gridSize) {
      graphics.lineBetween(x, 0, x, GAME_HEIGHT);
    }
    for (let y = 0; y < GAME_HEIGHT; y += gridSize) {
      graphics.lineBetween(0, y, GAME_WIDTH, y);
    }

    // Glowing background arena spotlight rings
    const ambientCircle = this.scene.add.graphics();
    ambientCircle.fillStyle(0x00f0ff, 0.03);
    ambientCircle.fillCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 350);
  }

  private createPlatforms() {
    // Main Ground Platform (Center bottom)
    const groundX = GAME_WIDTH / 2;
    const groundY = GAME_HEIGHT - 60;
    const groundWidth = 960;
    const groundHeight = 24;

    const groundGraphics = this.scene.add.graphics();
    groundGraphics.fillStyle(0x1e2640, 1);
    groundGraphics.fillRoundedRect(groundX - groundWidth / 2, groundY - groundHeight / 2, groundWidth, groundHeight, 6);
    
    // Top border glow line
    groundGraphics.lineStyle(3, 0x00f0ff, 0.8);
    groundGraphics.lineBetween(groundX - groundWidth / 2, groundY - groundHeight / 2, groundX + groundWidth / 2, groundY - groundHeight / 2);

    const groundZone = this.scene.add.zone(groundX, groundY, groundWidth, groundHeight);
    this.platforms.add(groundZone);

    // Left Elevated Platform
    this.createSubPlatform(280, 480, 220, 16);

    // Right Elevated Platform
    this.createSubPlatform(GAME_WIDTH - 280, 480, 220, 16);

    // Center High Platform
    this.createSubPlatform(GAME_WIDTH / 2, 340, 260, 16);
  }

  private createSubPlatform(x: number, y: number, width: number, height: number) {
    const platGraphics = this.scene.add.graphics();
    platGraphics.fillStyle(0x1e2640, 0.9);
    platGraphics.fillRoundedRect(x - width / 2, y - height / 2, width, height, 4);

    platGraphics.lineStyle(2, 0x3b82f6, 0.6);
    platGraphics.lineBetween(x - width / 2, y - height / 2, x + width / 2, y - height / 2);

    const zone = this.scene.add.zone(x, y, width, height);
    this.platforms.add(zone);
  }
}
