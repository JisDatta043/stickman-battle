"use client";

import { useEffect, useRef } from "react";
import { Stickman } from "@/phaser/objects/Stickman";
import { SoundManager } from "@/phaser/audio/SoundManager";
import { useGameStore } from "@/stores/useGameStore";

export interface StickmanOwner {
  player1?: Stickman;
}

export function useGameInput(target?: Stickman | StickmanOwner | null) {
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const getPlayer = (): Stickman | undefined => {
    if (!target) return undefined;
    if ("player1" in target && target.player1) {
      return target.player1;
    }
    if ("body" in target) {
      return target as Stickman;
    }
    return undefined;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const player = getPlayer();
      if (!player || !player.scene || !player.body) return;
      if (useGameStore.getState().status !== "playing" || useGameStore.getState().isPaused) return;

      // Prevent default scrolling on arrow keys & space
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
      }

      if (keysRef.current[e.code]) return; // Avoid key repeat spam for single actions
      keysRef.current[e.code] = true;

      // Handle Attacks on key down
      if (e.code === "KeyJ" || e.code === "KeyZ") {
        player.punch();
      } else if (e.code === "KeyK" || e.code === "KeyX") {
        player.kick();
      } else if (["KeyW", "ArrowUp", "Space"].includes(e.code)) {
        if (player.body?.blocked?.down) {
          player.body.setVelocityY(-560);
          SoundManager.playJump();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    const handleBlur = () => {
      keysRef.current = {};
    };

    const unsubscribe = useGameStore.subscribe((state) => {
      if (state.status !== "playing" || state.isPaused) {
        keysRef.current = {};
      }
    });

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    // Frame update loop for continuous movement (WASD / Arrows)
    const updateMovement = () => {
      const player = getPlayer();
      if (!player || !player.body || player.hp <= 0) return;

      if (useGameStore.getState().status !== "playing" || useGameStore.getState().isPaused) {
        player.body.setVelocityX(0);
        return;
      }

      const isLeft = keysRef.current["KeyA"] || keysRef.current["ArrowLeft"];
      const isRight = keysRef.current["KeyD"] || keysRef.current["ArrowRight"];
      const moveSpeed = 260;

      if (isLeft && !isRight) {
        player.body.setVelocityX(-moveSpeed);
        player.setFacingDirection("left");
      } else if (isRight && !isLeft) {
        player.body.setVelocityX(moveSpeed);
        player.setFacingDirection("right");
      } else {
        player.body.setVelocityX(0);
      }
    };

    const interval = setInterval(updateMovement, 1000 / 60);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      unsubscribe();
      clearInterval(interval);
    };
  }, [target]);

  // Mobile / Touch action triggers
  const triggerMoveLeft = (active: boolean) => {
    keysRef.current["KeyA"] = active;
  };

  const triggerMoveRight = (active: boolean) => {
    keysRef.current["KeyD"] = active;
  };

  const triggerJump = () => {
    const player = getPlayer();
    if (player?.body?.blocked?.down) {
      player.body.setVelocityY(-560);
      SoundManager.playJump();
    }
  };

  const triggerPunch = () => {
    getPlayer()?.punch();
  };

  const triggerKick = () => {
    getPlayer()?.kick();
  };

  return {
    triggerMoveLeft,
    triggerMoveRight,
    triggerJump,
    triggerPunch,
    triggerKick,
  };
}
