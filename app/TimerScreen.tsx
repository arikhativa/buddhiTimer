import { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { TimerForm } from '~/components/timer/form';
import { Text } from '~/components/ui/text';
import useTimerQuery from '~/hooks/useTimerQuery';

type Props = PropsWithChildren & {};

export function TimerScreen({}: Props) {
  const { data } = useTimerQuery();

  if (!data) {
    return <Text>no data</Text>;
  }

  return (
    <View className="flex-1 items-center justify-center">
      <TimerForm data={data[0]} />
    </View>
  );
}
