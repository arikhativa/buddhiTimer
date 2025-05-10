import { StaticScreenProps } from '@react-navigation/native';
import { TimerWheel } from '~/components/timer/TimerWheel';
import { useEmitValue } from '~/hooks/useEmitValue';

export type TimerWheelParams = {
  value: number;
};

type Props = StaticScreenProps<TimerWheelParams>;

export const TIMER_WHEEL_EVENT = 'timerWheelValue';

export function TimerWheelScreen({ route }: Props) {
  const { value } = route.params;

  const [tempValue, setTempValue] = useEmitValue(TIMER_WHEEL_EVENT, value);

  return (
    <TimerWheel
      className="mt-10"
      value={tempValue}
      onValueChange={setTempValue}
    />
  );
}
