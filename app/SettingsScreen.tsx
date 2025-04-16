import {useQuery} from '@tanstack/react-query';
import {PropsWithChildren} from 'react';
import {View} from 'react-native';
import {Text} from '~/components/ui/text';
import {Settings, SettingsUpdate, settingsKeyword} from '~/db/schema/settings';
import {SettingsService} from '~/services/settings';
import {SettingsForm} from '~/components/settings/form';
// import {settingsUpdateSchema} from '~/db/schema/settings';
type Props = PropsWithChildren & {};

export function SettingsScreen({}: Props) {
  const {isPending, error, data} = useQuery<Settings, Error>({
    queryKey: [settingsKeyword],
    queryFn: SettingsService.get,
  });

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

  return (
    <View>
      <Text className="bg-blue-200">Settting Screen: {data.theme}</Text>
      <SettingsForm data={data} />
    </View>
  );
}
