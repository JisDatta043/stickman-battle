import * as Phaser from "phaser";

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloaderScene" });
  }

  preload() {
    // Generate simple particle texture programmatically for damage sparks
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture("spark", 8, 8);
    graphics.destroy();
  }

  create() {
    this.scene.start("BattleScene");
    this.scene.start("UIScene");
  }
}
