import { PropsWithChildren, useEffect, useState } from 'react';
import WheelPicker from '@quidone/react-native-wheel-picker';
import { View } from 'react-native';
import { H1, H3 } from '../ui/typography';
import { sheardStrings } from '~/lib/strings/sheard';

type Props = PropsWithChildren & {
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

export function TimerWheel({ onValueChange, value }: Props) {
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

  return (
    <View className="flex ">
      <View className="justify-center flex-row gap-4">
        <View className="w-30">
          <H3>{sheardStrings.time.hours}</H3>
          <WheelPicker
            data={list24}
            width={WIDTH}
            value={hour}
            onValueChanged={({ item: { value } }) => setHour(value)}
          />
        </View>
        <Col />
        <View className="w-30">
          <H3>{sheardStrings.time.minutes}</H3>
          <WheelPicker
            data={list60}
            value={min}
            width={WIDTH}
            onValueChanged={({ item: { value } }) => setMin(value)}
          />
        </View>
        <Col />
        <View className="w-30">
          <H3>{sheardStrings.time.seconds}</H3>
          <WheelPicker
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
