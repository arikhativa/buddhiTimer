import { PropsWithChildren } from 'react';
import { TouchableOpacity } from 'react-native';
type Props = PropsWithChildren & {
  index: number;
  onLongPress?: (index: number) => void;
  onPress: (index: number) => void;
};

export function Line({ children, index, onLongPress, onPress }: Props) {
  return (
    <TouchableOpacity
      className="mx-4 py-4 flex-row justify-between items-center"
      onLongPress={() => onLongPress?.(index)}
      onPress={() => onPress(index)}>
      {children}
    </TouchableOpacity>
  );
}
