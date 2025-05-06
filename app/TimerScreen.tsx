import { StaticScreenProps } from '@react-navigation/native';
import { View } from 'react-native';
import { Spinner } from '~/components/sheard/Spinner';
import { TimerForm } from '~/components/timer/form';
import useTimerQuery from '~/hooks/useTimerQuery';

export type TimerParams = {
  id?: number;
};

type Props = StaticScreenProps<TimerParams>;

export function TimerScreen({ route }: Props) {
  const { id } = route.params;

  const query = useTimerQuery(id);

  return (
    <Spinner query={query} allowEmpty>
      <View className="flex-1 items-center justify-center">
        <TimerForm data={query.data} />
      </View>
    </Spinner>
  );
}
