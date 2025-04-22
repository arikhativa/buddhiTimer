import { useEffect, useState } from 'react';
import { Input } from '../ui/input';

interface Props {
  onChange: (v: number) => void;
  value: number;
}

export default function InputNumber({ onChange, value }: Props) {
  const [stringValue, setStringValue] = useState(value.toString());

  useEffect(() => {
    setStringValue(value.toString());
  }, [value]);

  const onStringChange = (text: string) => {
    const parsed = parseFloat(text);
    onChange(isNaN(parsed) ? 0 : parsed);
  };

  return <Input value={stringValue} onChangeText={onStringChange} />;
}
