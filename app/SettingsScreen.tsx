import { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { SettingsForm } from '~/components/settings/form';
import useSettingsQuery from '~/hooks/useSettingsQuery';
type Props = PropsWithChildren & {};

export function SettingsScreen({}: Props) {
  const { isPending, error, data } = useSettingsQuery();

  // TODO: better sipnner
  if (isPending) {
    return (
      <View>
        <Text className="bg-blue-200">Loading</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text className="bg-blue-200">Error</Text>
      </View>
    );
  }

  if (!data.theme) {
    return (
      <View>
        <Text className="bg-blue-200">no data</Text>
      </View>
    );
  }

  return <SettingsForm data={data} />;
}
