"use client";

import { useEffect, useRef } from "react";
import { Stickman } from "@/phaser/objects/Stickman";
import { SoundManager } from "@/phaser/audio/SoundManager";

export function useGameInput(player?: Stickman) {
  const keysRef = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!player || !player.scene) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!player || !player.scene || !player.body) return;

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

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Frame update loop for continuous movement (WASD / Arrows)
    const updateMovement = () => {
      if (!player || !player.body || player.hp <= 0) return;

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
      clearInterval(interval);
    };
  }, [player]);

  // Mobile / Touch action triggers
  const triggerMoveLeft = (active: boolean) => {
    keysRef.current["KeyA"] = active;
  };

  const triggerMoveRight = (active: boolean) => {
    keysRef.current["KeyD"] = active;
  };

  const triggerJump = () => {
    if (player?.body?.blocked?.down) {
      player.body.setVelocityY(-560);
      SoundManager.playJump();
    }
  };

  const triggerPunch = () => {
    player?.punch();
  };

  const triggerKick = () => {
    player?.kick();
  };

  return {
    triggerMoveLeft,
    triggerMoveRight,
    triggerJump,
    triggerPunch,
    triggerKick,
  };
}
