import { StaticScreenProps } from '@react-navigation/native';
import { timerSchema } from '~/db/schema';
import { ErrorScreen } from './ErrorScreen';
import { CountdownLogic } from '~/components/countdown/CountdownLogic';

export type CountdownParams = {
  timerEncoded: string;
};

type Props = StaticScreenProps<CountdownParams>;

export function CountdownScreen({ route }: Props) {
  const { timerEncoded } = route.params;

  if (!timerEncoded) {
    console.error('Countdown error: missing timerEncoded');
    return <ErrorScreen />;
  }

  const decoded = decodeURIComponent(timerEncoded);
  const rawString = JSON.parse(decoded);
  const pasred = timerSchema.safeParse(rawString);

  if (pasred.error) {
    console.error('Countdown error: ', pasred.error);
    return <ErrorScreen />;
  }

  const timer = pasred.data;

  return <CountdownLogic timer={timer} />;
}
