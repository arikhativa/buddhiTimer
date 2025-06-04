// soundPlayer.ts
import Sound from 'react-native-sound';

// import { Image } from 'react-native';
Sound.setCategory('AudioProcessing', true);

export class SoundPlayer {
  private sound: Sound | null = null;
  private isLoaded: boolean = false;

  constructor(filename: string, basePath = Sound.MAIN_BUNDLE) {
    if (this.isLoaded) {
      console.log('loaded');
      return;
    }
    this.sound = new Sound(filename, basePath, error => {
      if (error) {
        console.error('Failed to load the sound', error);
        return;
      }
      this.isLoaded = true;
    });
  }

  play(onEnd?: () => void) {
    this.sound?.setCurrentTime(0);
    this.sound?.play(success => {
      if (success) {
        onEnd?.();
      } else {
        console.log('error');
      }
    });
  }

  pause() {
    this.sound?.pause();
  }

  stop() {
    this.sound?.stop();
  }

  release() {
    this.sound?.release();
  }
}
