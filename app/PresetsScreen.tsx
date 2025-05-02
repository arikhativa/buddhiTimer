import { useNavigation } from '@react-navigation/native';
import { Text, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Timer } from '~/db/schema';
import useTimerListQuery from '~/hooks/useTimerListQuery';
import { Plus } from '~/lib/icons/Plus';

function Line({ data }: { data: Timer }) {
  return <Text>{data.id}</Text>;
}

export function PresetsScreen() {
  const navigation = useNavigation();
  const { data } = useTimerListQuery();
  if (!data) {
    return (
      <Button
        onPress={() => {
          navigation.navigate('Timer', {});
        }}
        variant={'outline'}
        size={'icon'}>
        <Plus />
      </Button>
    );
  }

  return (
    <View>
      {data.map(e => {
        return <Line key={e.id} data={e} />;
      })}
    </View>
  );
}
