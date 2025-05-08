import { useEffect, useRef } from 'react';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { TimerWheel } from '~/components/timer/TimerWheel';
import { eventEmitter } from '~/lib/events';

export type TimerWheelParams = {
  value: number;
};

type Props = StaticScreenProps<TimerWheelParams>;

export function TimerWheelScreen({ route }: Props) {
  const { value } = route.params;
  const navigation = useNavigation();
  const [tempValue, setTempValue] = useState(value);

  const tempValueRef = useRef(tempValue);
  useEffect(() => {
    tempValueRef.current = tempValue;
  }, [tempValue]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      eventEmitter.emit('timerWheelValue', tempValueRef.current);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <TimerWheel
      className="mt-10"
      value={tempValue}
      onValueChange={setTempValue}
    />
  );
}
