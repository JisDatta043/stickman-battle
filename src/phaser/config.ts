import * as Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "@/utils/constants";
import { PreloaderScene } from "./scenes/PreloaderScene";
import { BattleScene } from "./scenes/BattleScene";
import { UIScene } from "./scenes/UIScene";

export const getPhaserConfig = (containerId: string): Phaser.Types.Core.GameConfig => {
  return {
    type: Phaser.AUTO,
    parent: containerId,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: "#0a0c14",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 1200 },
        debug: false,
      },
    },
    fps: {
      target: 60,
      forceSetTimeOut: false,
    },
    scene: [PreloaderScene, BattleScene, UIScene],
  };
};
