import { View } from 'react-native';
import { Timer } from '~/db/schema';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { H1, H2, Large, P } from '~/components/ui/typography';
import { timerStrings } from '~/lib/strings/timer';
import { useCallback, useState } from 'react';
import { Button } from '../ui/button';
import { Play } from '~/lib/icons/Play';
import { Pause } from '~/lib/icons/Pause';
import { sheardStrings } from '~/lib/strings/sheard';
import { CircleButton } from '../sheard/CircleButton';

type Props = {
  timer: Timer;
};

export function CountdownLogic({ timer }: Props) {
  const [play, setPlay] = useState(true);

  const togglePlay = useCallback(() => {
    setPlay(prev => !prev);
  }, [setPlay]);

  let isWarmup = !!timer.warmUp;

  return (
    <View className=" flex-1 justify-center ">
      {isWarmup && (
        <Large className="mb-4">{timerStrings.countdown.warmUp}</Large>
      )}
      <View className="flex-1 flex justify-center items-center ">
        <CountdownCircleTimer
          isPlaying={play}
          duration={7}
          colors={['#004777', '#F7B801', '#A30000', '#A30000']}
          colorsTime={[7, 5, 2, 0]}>
          {({ remainingTime }) => <H1>{remainingTime}</H1>}
        </CountdownCircleTimer>
      </View>
      <View className=" mb-20 mx-4">
        <Button
          variant={'link'}
          className="flex justify-center items-center mb-20"
          onPress={togglePlay}>
          {play ? <Pause size={50} /> : <Play size={50} />}
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
