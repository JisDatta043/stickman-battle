import * as Phaser from "phaser";

export class Hitbox extends Phaser.GameObjects.Zone {
  public damage: number = 0;
  public knockback: { x: number; y: number } = { x: 0, y: 0 };
  public ownerId: string = "";
  public declare body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(scene, x, y, width, height);
    scene.add.existing(this);
    scene.physics.add.existing(this, false); // Dynamic Arcade body so setPosition updates body position
    this.body.setAllowGravity(false);
    this.body.setSize(width, height);
    this.deactivate();
  }

  public activate(ownerId: string, damage: number, knockback: { x: number; y: number }) {
    this.ownerId = ownerId;
    this.damage = damage;
    this.knockback = knockback;
    if (this.body) {
      this.body.enable = true;
    }
  }

  public deactivate() {
    if (this.body) {
      this.body.enable = false;
    }
  }
}
