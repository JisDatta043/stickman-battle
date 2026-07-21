import * as Phaser from "phaser";

export class Hitbox extends Phaser.GameObjects.Zone {
  public damage: number = 0;
  public knockback: { x: number; y: number } = { x: 0, y: 0 };
  public ownerId: string = "";

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(scene, x, y, width, height);
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body sensor
  }

  public activate(ownerId: string, damage: number, knockback: { x: number; y: number }) {
    this.ownerId = ownerId;
    this.damage = damage;
    this.knockback = knockback;
    (this.body as Phaser.Physics.Arcade.Body).enable = true;
  }

  public deactivate() {
    (this.body as Phaser.Physics.Arcade.Body).enable = false;
  }
}
