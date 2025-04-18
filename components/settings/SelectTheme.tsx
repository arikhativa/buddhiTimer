import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { settingsScreenString } from '~/lib/strings/settingsScreen';
import { capitalizeFirstLetter } from '~/lib/utils';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SelectTheme({ value, onChange }: Props) {
  const insets = useSafeAreaInsets();

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const items = settingsScreenString.items;

  const capitalized = capitalizeFirstLetter(value);

  const option = {
    value: capitalized,
    label: capitalized,
  };
  return (
    <Select
      value={option}
      onValueChange={o => {
        o && onChange(o.value.toLowerCase());
      }}>
      <SelectTrigger className="w-[250px]">
        <SelectValue
          className="text-foreground text-sm native:text-lg"
          placeholder=""
        />
      </SelectTrigger>
      <SelectContent insets={contentInsets} className="w-[250px]">
        <SelectGroup>
          {items.map(e => (
            <SelectItem key={e} label={e} value={e} />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
