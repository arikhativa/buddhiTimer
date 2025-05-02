import { StaticScreenProps } from '@react-navigation/native';
import { View } from 'react-native';
import { TimerForm } from '~/components/timer/form';
import useTimerQuery from '~/hooks/useTimerQuery';

type Params = {
  id: number;
};

type Props = StaticScreenProps<Params>;

export function TimerScreen({ route }: Props) {
  const { id } = route.params;

  const { data } = useTimerQuery(id);

  return (
    <View className="flex-1 items-center justify-center">
      <TimerForm data={data} />
    </View>
  );
}
