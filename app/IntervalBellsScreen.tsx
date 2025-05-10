import { StaticScreenProps } from '@react-navigation/native';
import { IntervalBell, IntervalBellSchema } from '~/db/schema';
import { IntervalBellsForm } from '~/components/intervalBells/form';
import { useEmitValue } from '~/hooks/useEmitValue';

export type IntervalBellsParams = {
  list: IntervalBell[];
};

type Props = StaticScreenProps<IntervalBellsParams>;

export const INERVAL_BELL_EVENT = 'INERVAL_BELL_EVENT';

export function IntervalBellsScreen({ route }: Props) {
  const { list } = route.params;
  const tmp: IntervalBellSchema[] = [...list];
  const [value, onChange] = useEmitValue(INERVAL_BELL_EVENT, tmp);

  return <IntervalBellsForm value={value} onChange={onChange} />;
}
