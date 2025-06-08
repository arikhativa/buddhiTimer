import Sound from 'react-native-sound';

Sound.setCategory('Playback', true);

export class SoundPlayer {
  private sound: Sound | null = null;
  private isPlaying: boolean = false;

  constructor(filename: string, basePath = Sound.MAIN_BUNDLE) {
    this.loadSound(filename, basePath);
  }

  private loadSound(filename: string, basePath: string) {
    this.sound = new Sound(filename, basePath, error => {
      if (error) {
        console.error('Failed to load the sound', error);
        return;
      }
    });
    this.sound?.setVolume(1.0);
  }

  play(reset = false, onEnd?: () => void) {
    if (reset) this.sound?.setCurrentTime(0);
    this.sound?.play(success => {
      if (success) {
        this.isPlaying = true;
        onEnd?.();
      } else {
        console.log('error during playback');
        this.isPlaying = false;
      }
    });
  }

  pause() {
    this.sound?.pause();
    this.isPlaying = false;
  }

  stop() {
    this.sound?.stop();
    this.isPlaying = false;
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  release() {
    this.sound?.release();
    this.isPlaying = false;
    this.sound = null;
  }

  replaceTrack(filename: string, autoPlay = false) {
    this.sound?.stop(() => {
      this.loadSound(filename, Sound.MAIN_BUNDLE);

      if (autoPlay) {
        const checkReady = setInterval(() => {
          if (this.sound?.isLoaded()) {
            clearInterval(checkReady);
            this.play();
          }
        }, 50);
      }
    });
  }
}
