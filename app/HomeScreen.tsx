import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import { CardButton } from '~/components/home/cardButton';
import { ChartNoAxesCombined } from '~/lib/icons/ChartNoAxesCombined';
import { Settings } from '~/lib/icons/Settings';
import { SquareStack } from '~/lib/icons/SquareStack';
import { Timer } from '~/lib/icons/Timer';

export function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex flex-1 justify-center items-center">
      <View className="flex flex-row flex-wrap justify-between w-full px-4">
        <View className="w-1/2 p-2">
          <CardButton
            title="Timer"
            icon={Timer}
            onPress={() => {
              navigation.navigate('Timer', {});
            }}
          />
        </View>
        <View className="w-1/2 p-2">
          <CardButton
            title="Presets"
            icon={SquareStack}
            onPress={() => navigation.navigate('Presets')}
          />
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
