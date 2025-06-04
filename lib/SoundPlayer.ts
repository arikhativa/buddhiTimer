import Sound from 'react-native-sound';

Sound.setCategory('Playback', true);

export class SoundPlayer {
  private sound: Sound | null = null;

  constructor(filename: string, basePath = Sound.MAIN_BUNDLE) {
    this.sound = new Sound(filename, basePath, error => {
      if (error) {
        console.error('Failed to load the sound', error);
        return;
      }
    });
    this.sound?.setVolume(1.0);
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
