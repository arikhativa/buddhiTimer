import { StaticScreenProps } from '@react-navigation/native';
import { Spinner } from '~/components/sheard/Spinner';
import { H1 } from '~/components/ui/typography';
import useTimerQuery from '~/hooks/useTimerQuery';

export type CountdownParams = {
  timerId?: number;
};

type Props = StaticScreenProps<CountdownParams>;

export function CountdownScreen({ route }: Props) {
  const { timerId } = route.params;

  const query = useTimerQuery(timerId);
  return (
    <Spinner query={query}>
      <H1>{query?.data?.name}</H1>
    </Spinner>
  );
}
