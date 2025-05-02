import { useNavigation } from '@react-navigation/native';
import { Text, View } from 'react-native';
import { CardButton } from '~/components/home/cardButton';
import { Button } from '~/components/ui/button';
import useTimerQuery from '~/hooks/useTimerQuery';
import { ChartNoAxesCombined } from '~/lib/icons/ChartNoAxesCombined';
import { Plus } from '~/lib/icons/Plus';
import { Settings } from '~/lib/icons/Settings';
import { SquareStack } from '~/lib/icons/SquareStack';
import { Timer } from '~/lib/icons/Timer';
import { CRUD_MODE } from '~/lib/types/sheard';

export function PresetsScreen() {
  const navigation = useNavigation();
  const { data } = useTimerQuery();
  if (!data) {
    return (
      <Button
        onPress={() => {
          navigation.navigate('Timer', {
            mode: CRUD_MODE.CREATE,
          });
        }}
        variant={'outline'}
        size={'icon'}>
        <Plus />
      </Button>
    );
  }
  return (
    <View className="flex flex-1 justify-center items-center">
      <View className="flex flex-row flex-wrap justify-between w-full px-4">
        <View className="w-1/2 p-2">
          <CardButton
            title="Timer"
            icon={Timer}
            onPress={() => {
              navigation.navigate('Timer');
            }}
          />
        </View>
        <View className="w-1/2 p-2">
          <CardButton disabled title="Presets" icon={SquareStack} />
        </View>
        <View className="w-1/2 p-2">
          <CardButton
            title="Settings"
            icon={Settings}
            onPress={() => {
              navigation.navigate('Settings');
            }}
          />
        </View>
        <View className="w-1/2 p-2">
          <CardButton disabled title="Statistics" icon={ChartNoAxesCombined} />
        </View>
      </View>
    </View>
  );
}
