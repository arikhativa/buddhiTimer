import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { LucideIcon } from 'lucide-react-native';

type Props = {
  title: string;
  icon: LucideIcon;
  disabled?: boolean;
  onPress?: () => void;
};

export function CardButton({ disabled, title, icon: Icon, onPress }: Props) {
  const theme = useTheme();

  const disabledStyle = 'opacity-40';
  const style = 'border-2';

  return (
    <Pressable disabled={disabled} onPress={onPress}>
      <Card className={disabled ? disabledStyle : style}>
        <CardHeader className="flex justify-center items-center">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <Icon color={theme.colors.primary} />
        </CardContent>
      </Card>
    </Pressable>
  );
}
