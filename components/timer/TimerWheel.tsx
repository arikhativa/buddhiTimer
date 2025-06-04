import { PropsWithChildren, memo, useEffect, useState } from 'react';
import { useColorScheme } from '~/lib/useColorScheme';
import WheelPicker from '@quidone/react-native-wheel-picker';
import { StyleProp, TextStyle, View } from 'react-native';
import { H1, H3 } from '../ui/typography';
import { sheardStrings } from '~/lib/strings/sheard';
import { cn } from '~/lib/utils';
import { useTheme } from '@react-navigation/native';

type Props = PropsWithChildren & {
  className?: string;
  onValueChange: (v: number) => void;
  value: number;
};

const list24 = [...Array(24).keys()].map(index => ({
  value: index,
  label: index.toString(),
}));

const list60 = [...Array(60).keys()].map(index => ({
  value: index,
  label: index.toString(),
}));

function Col() {
  return (
    <View className="h-full">
      <H3></H3>
      <View className="flex-1 justify-center items-center">
        <H1 className="">:</H1>
      </View>
    </View>
  );
}

const WIDTH = 80;

function TimerWheelComponent({ className, onValueChange, value }: Props) {
  const theme = useTheme();
  const initialHour = Math.floor(value / 3600);
  const initialMin = Math.floor((value % 3600) / 60);
  const initialSec = value % 60;

  const [hour, setHour] = useState(initialHour);
  const [min, setMin] = useState(initialMin);
  const [sec, setSec] = useState(initialSec);

  useEffect(() => {
    const total = hour * 3600 + min * 60 + sec;
    onValueChange(total);
  }, [hour, min, sec, onValueChange]);

  const overlayItemStyle: StyleProp<TextStyle> = {
    backgroundColor: '#dddddd',
  };

  const textStyle: StyleProp<TextStyle> = {
    color: theme.colors.text,
  };

  return (
    <View className={cn(className, 'flex')}>
      <View className="justify-center flex-row gap-4">
        <View className="w-30">
          <H3 className="self-center">{sheardStrings.time.hours}</H3>
          <WheelPicker
            itemTextStyle={theme.dark && textStyle}
            overlayItemStyle={theme.dark && overlayItemStyle}
            data={list24}
            width={WIDTH}
            value={hour}
            onValueChanged={({ item: { value } }) => setHour(value)}
          />
        </View>
        <Col />
        <View className="w-30">
          <H3 className="self-center">{sheardStrings.time.minutes}</H3>
          <WheelPicker
            itemTextStyle={theme.dark && textStyle}
            overlayItemStyle={theme.dark && overlayItemStyle}
            data={list60}
            value={min}
            width={WIDTH}
            onValueChanged={({ item: { value } }) => setMin(value)}
          />
        </View>
        <Col />
        <View className="w-30">
          <H3 className="self-center">{sheardStrings.time.seconds}</H3>
          <WheelPicker
            itemTextStyle={theme.dark && textStyle}
            overlayItemStyle={theme.dark && overlayItemStyle}
            data={list60}
            value={sec}
            width={WIDTH}
            onValueChanged={({ item: { value } }) => setSec(value)}
          />
        </View>
      </View>
    </View>
  );
}

function areEqual(prev: Props, next: Props) {
  return (
    // prev.onValueChange === next.onValueChange &&
    prev.className === next.className
  );
}

export const TimerWheel = memo(TimerWheelComponent, areEqual);
