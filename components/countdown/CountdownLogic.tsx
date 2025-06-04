import { View } from 'react-native';
import { Timer } from '~/db/schema';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { H1, Large, P } from '~/components/ui/typography';
import { timerStrings } from '~/lib/strings/timer';
import { useCallback, useState } from 'react';
import { Button } from '../ui/button';
import { Play } from '~/lib/icons/Play';
import { Pause } from '~/lib/icons/Pause';
import { sheardStrings } from '~/lib/strings/sheard';
import { formatSeconds } from '~/lib/utils';

type Props = {
  timer: Timer;
};

export function CountdownLogic({ timer }: Props) {
  const [play, setPlay] = useState(true);
  const [isWarmUp, setIsWarmUp] = useState(!!timer.warmUp);
  const [duration, setDuration] = useState(timer.warmUp || timer.duration);

  const togglePlay = useCallback(() => {
    setPlay(prev => !prev);
  }, [setPlay]);

  const handleTimerComplete = () => {
    if (isWarmUp) {
      setIsWarmUp(false);
      setDuration(timer.duration);
    }
  };
  return (
    <View className=" flex-1 justify-center ">
      <View className="flex-1 flex justify-center items-center ">
        {isWarmUp ? (
          <Large className="mb-4">{timerStrings.countdown.warmUp}</Large>
        ) : (
          <Large className="mb-4"> </Large>
        )}
        <CountdownCircleTimer
          isPlaying={play}
          onComplete={handleTimerComplete}
          duration={duration}
          colors={['#004777', '#F7B801', '#A30000', '#A30000']}
          colorsTime={[7, 5, 2, 0]}>
          {({ remainingTime }) => <H1>{formatSeconds(remainingTime)}</H1>}
        </CountdownCircleTimer>
      </View>
      <View className=" mb-20 mx-4">
        <Button
          variant={'link'}
          className="flex justify-center items-center mb-20"
          onPress={togglePlay}>
          {play ? (
            <Pause className="text-foreground" size={50} />
          ) : (
            <Play className="text-foreground" size={50} />
          )}
        </Button>

        <Button className="" variant={'secondary'} onPress={() => {}}>
          <Large className="">{sheardStrings.finish}</Large>
        </Button>
        <Button className="" variant={'ghost'} onPress={() => {}}>
          <P className="">{timerStrings.countdown.discard}</P>
        </Button>
      </View>
    </View>
  );
}
