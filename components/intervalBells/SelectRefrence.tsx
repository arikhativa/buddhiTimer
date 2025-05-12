import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { IntervalBellSchema } from '~/db/schema';
import { timerStrings } from '~/lib/strings/timer';

interface Props {
  value: string;
  onChange: (v: string) => void;
}
interface Option {
  value: IntervalBellSchema['reference'];
  label: string;
}

export default function SelectRefrance({ value, onChange }: Props) {
  const insets = useSafeAreaInsets();

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const options: Option[] = [
    {
      value: 'fromStart',
      label: timerStrings.intervalBells.refrance.start,
    },
    {
      value: 'beforeEnd',
      label: timerStrings.intervalBells.refrance.end,
    },
  ];

  const option = options.find(e => e.value === value);

  return (
    <Select
      value={option}
      onValueChange={o => {
        o && onChange(o.value);
      }}>
      <SelectTrigger className="w-[250px]">
        <SelectValue
          className="text-foreground text-sm native:text-lg"
          placeholder=""
        />
      </SelectTrigger>
      <SelectContent insets={contentInsets} className="w-[250px]">
        <SelectGroup>
          {options.map(e => (
            <SelectItem key={e.value} label={e.label} value={e.value} />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
