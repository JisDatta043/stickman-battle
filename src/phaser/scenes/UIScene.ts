import * as Phaser from "phaser";
import { useGameStore } from "@/stores/useGameStore";
import { usePlayerStore } from "@/stores/usePlayerStore";

export class UIScene extends Phaser.Scene {
  private timerEvent?: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: "UIScene" });
  }

  create() {
    this.startRoundTimer();
  }

  public startRoundTimer() {
    if (this.timerEvent) {
      this.timerEvent.destroy();
    }

    useGameStore.getState().setRoundTimer(60);

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        const gameStore = useGameStore.getState();
        if (gameStore.status === "playing" && !gameStore.isPaused) {
          gameStore.setRoundTimer((prev) => {
            if (prev <= 1) {
              this.handleTimeUp();
              return 0;
            }
            return prev - 1;
          });
        }
      },
    });
  }

  private handleTimeUp() {
    const p1Hp = usePlayerStore.getState().p1Hp;
    const p2Hp = usePlayerStore.getState().p2Hp;

    let winnerId: string | null = null;
    let winnerName = "Draw";

    if (p1Hp > p2Hp) {
      winnerId = "p1";
      winnerName = usePlayerStore.getState().p1Name;
      useGameStore.getState().incrementScoreP1();
    } else if (p2Hp > p1Hp) {
      winnerId = "p2";
      winnerName = usePlayerStore.getState().p2Name;
      useGameStore.getState().incrementScoreP2();
    }

    useGameStore.getState().setRoundResult({
      winnerId,
      winnerName,
      reason: "timeup",
      scores: {
        p1: useGameStore.getState().scoreP1,
        p2: useGameStore.getState().scoreP2,
      },
    });

    useGameStore.getState().setGameStatus("roundOver");
  }
}
