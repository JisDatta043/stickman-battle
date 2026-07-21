import { soundSynth } from "@/utils/audioSynth";

export class SoundManager {
  public static playPunch() {
    soundSynth.playPunch();
  }

  public static playKick() {
    soundSynth.playKick();
  }

  public static playJump() {
    soundSynth.playJump();
  }

  public static playHurt() {
    soundSynth.playHurt();
  }

  public static playVictory() {
    soundSynth.playVictory();
  }

  public static playClick() {
    soundSynth.playClick();
  }
}
