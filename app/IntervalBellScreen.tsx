import { StaticScreenProps } from '@react-navigation/native';
import { View } from 'react-native';
import SelectRefrance from '~/components/intervalBells/SelectRefrence';
import { TimerWheel } from '~/components/timer/TimerWheel';
import { IntervalBellSchema } from '~/db/schema';
import { useEmitValue } from '~/hooks/useEmitValue';

export type IntervalBellParams = {
  value: IntervalBellSchema;
};

type Props = StaticScreenProps<IntervalBellParams>;

export const INTERVAL_BELL_EVENT = 'INTERVAL_BELL_EVENT';

export function IntervalBellScreen({ route }: Props) {
  const { value } = route.params;

  const [local, setLocal] = useEmitValue(INTERVAL_BELL_EVENT, value);

  return (
    <View className="flex-1 justify-center items-center gap-8 mt-10">
      <TimerWheel
        value={local.duration}
        onValueChange={v => {
          setLocal(prev => ({ ...prev, duration: v }));
        }}
      />
      <SelectRefrance
        value={local.reference}
        onChange={v => {
          setLocal(prev => ({
            ...prev,
            reference: v as IntervalBellSchema['reference'],
          }));
        }}
      />
    </View>
  );
}
