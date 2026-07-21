"use client";

import { useEffect, useRef, useState } from "react";
import type Phaser from "phaser";
import { getPhaserConfig } from "@/phaser/config";
import { BattleScene } from "@/phaser/scenes/BattleScene";

export function usePhaser(containerId: string) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [battleScene, setBattleScene] = useState<BattleScene | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initPhaser() {
      if (typeof window === "undefined" || gameRef.current) return;

      const PhaserLib = await import("phaser");
      const config = getPhaserConfig(containerId);

      if (isMounted) {
        const game = new PhaserLib.default.Game(config);
        gameRef.current = game;

        // Poll for BattleScene initialization
        const checkScene = setInterval(() => {
          if (game.scene.isSleeping("BattleScene") || game.scene.isActive("BattleScene")) {
            const scene = game.scene.getScene("BattleScene") as BattleScene;
            if (scene) {
              setBattleScene(scene);
              setIsReady(true);
              clearInterval(checkScene);
            }
          }
        }, 100);
      }
    }

    initPhaser();

    return () => {
      isMounted = false;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [containerId]);

  return { game: gameRef.current, battleScene, isReady };
}
