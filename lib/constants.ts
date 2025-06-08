export const NAV_THEME = {
  light: {
    background: 'hsl(0 0% 100%)', // background
    border: 'hsl(240 5.9% 90%)', // border
    card: 'hsl(0 0% 100%)', // card
    notification: 'hsl(0 84.2% 60.2%)', // destructive
    primary: 'hsl(284 73% 69.3%)', // primary
    text: 'hsl(240 10% 3.9%)', // foreground
  },
  dark: {
    background: 'hsl(240 10% 3.9%)', // background
    border: 'hsl(240 3.7% 15.9%)', // border
    card: 'hsl(240 10% 3.9%)', // card
    notification: 'hsl(0 72% 51%)', // destructive
    primary: 'hsl(284 73% 33.4%)', // primary
    text: 'hsl(0 0% 98%)', // foreground
  },
};

export const MINUTE = 60 * 1;
export const USE_QUERY_STALE_TIME = 5 * MINUTE;
export const BAD_ID = 0;

export interface Track {
  file: string;
  text: string;
}

export const ADIUO_TRACKS: Track[] = [
  {
    file: 'cymbal_transition_sound_effect.mp3',
    text: 'Meditation Bowl',
  },
  {
    file: 'loud_gong_sound_effect.mp3',
    text: 'Meditation Singing Bowl',
  },
  {
    file: 'meditation_bowl_sound.mp3',
    text: 'Tibetan Singing Bowl',
  },
  {
    file: 'meditation_singing_bowl_sound.mp3',
    text: 'Tinkle',
  },
  {
    file: 'tibetan_singing_bowl_sound.mp3',
    text: 'Yeat Bell',
  },
  {
    file: 'tinkle_sound_effect.mp3',
    text: 'Loud Gong',
  },
  {
    file: 'yeat_bell_sound_effect.mp3',
    text: 'Cymbal Transition',
  },
];
