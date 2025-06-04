import Sound from 'react-native-sound';

Sound.setCategory('Playback', true);

export class SoundPlayer {
  private sound: Sound | null = null;
  private isPlaying: boolean = false;

  constructor(filename: string, basePath = Sound.MAIN_BUNDLE) {
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
        this.isPlaying = false;
        onEnd?.();
      } else {
        console.log('error during playback');
        this.isPlaying = false;
      }
    });
    this.isPlaying = true;
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
  }
}
