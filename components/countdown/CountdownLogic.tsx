import { View } from 'react-native';
import { Timer } from '~/db/schema';
import {
  ColorFormat,
  CountdownCircleTimer,
  MultipleColors,
} from 'react-native-countdown-circle-timer';
import { H1, Large, P } from '~/components/ui/typography';
import { timerStrings } from '~/lib/strings/timer';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Pause } from '~/lib/icons/Pause';
import { sheardStrings } from '~/lib/strings/sheard';
import { formatSeconds } from '~/lib/utils';
import { Play } from '~/lib/icons/Play';
import { useTheme } from '@react-navigation/native';

type Props = {
  timer: Timer;
};

const WHITE_RGB = '#FFFFFF';

export function CountdownLogic({ timer }: Props) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const [isWarmUp, setIsWarmUp] = useState(!!timer.warmUp);
  const [duration, setDuration] = useState(timer.warmUp || timer.duration);
  const [key, setKey] = useState(0);

  const [colors, setColors] = useState<ColorFormat>(WHITE_RGB);
  const theme = useTheme();

  useEffect(() => {
    setColors(theme.colors.primary as ColorFormat);
  }, [theme.colors.primary]);

  const toggleisPlaying = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, [setIsPlaying]);

  const handleTimerComplete = () => {
    if (isWarmUp) {
      setIsWarmUp(false);
    } else {
      setIsDone(true);
      setColors(WHITE_RGB);
      setIsPlaying(false);
    }
    setDuration(timer.duration);
    setKey(prev => ++prev);
  };

  return (
    <View className=" flex-1 justify-center ">
      <View className="flex-1 flex justify-center items-center ">
        {isWarmUp ? (
          <Large className="mb-4">{timerStrings.countdown.warmUp}</Large>
        ) : (
          <Large className="mb-4">
            {isDone ? timerStrings.countdown.done : ' '}
          </Large>
        )}
        <CountdownCircleTimer
          key={key}
          isPlaying={isPlaying}
          onComplete={handleTimerComplete}
          duration={duration}
          colors={colors}>
          {({ remainingTime }) => <H1>{formatSeconds(remainingTime)}</H1>}
        </CountdownCircleTimer>
      </View>
      <View className=" mb-20 mx-4 gap-4">
        <Button
          variant={'link'}
          className="flex justify-center items-center mb-20"
          onPress={toggleisPlaying}>
          {isPlaying ? (
            <Pause className="text-foreground" size={50} />
          ) : (
            !isDone && <Play className="text-foreground" size={50} />
          )}
        </Button>

        <Button
          className={isPlaying ? 'opacity-0' : ''}
          variant={'secondary'}
          onPress={() => {}}>
          <Large className="">{sheardStrings.finish}</Large>
        </Button>
        <Button
          className={isPlaying ? 'opacity-0' : ''}
          variant={'ghost'}
          onPress={() => {}}>
          <P>{timerStrings.countdown.discard}</P>
        </Button>
      </View>
    </View>
  );
}
