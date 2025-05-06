import { useNavigation } from '@react-navigation/native';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Spinner } from '~/components/sheard/Spinner';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { H1, H2, Large, Muted, P } from '~/components/ui/typography';
import { Timer } from '~/db/schema';
import useTimerListQuery from '~/hooks/useTimerListQuery';
import { Plus } from '~/lib/icons/Plus';
import { sheardStrings } from '~/lib/strings/sheard';
import { formatSeconds } from '~/lib/utils';

function Line({ item, navigation }: { item: Timer; navigation: any }) {
  return (
    <TouchableOpacity
      className="flex-1 justify-between items-center flex-row mx-4 py-4 w-fit "
      onPress={() => navigation.navigate('Timer', { id: item.id })}>
      <Large>{item.id}</Large>
      <Muted>{formatSeconds(item.duration)}</Muted>
    </TouchableOpacity>
  );
}

export function PresetsScreen() {
  const navigation = useNavigation();
  const query = useTimerListQuery();
  const { data } = query;

  return (
    <Spinner query={query}>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <Line item={item} navigation={navigation} />}
        ItemSeparatorComponent={() => <Separator className="mx-5 w-fit" />}
        ListEmptyComponent={
          <Muted className="my-4 self-center">{sheardStrings.noItems}</Muted>
        }
        ListFooterComponent={
          <>
            <Separator className="mx-5 w-fit" />
            <Button
              className="my-4 self-center"
              onPress={() => {
                navigation.navigate('Timer', {});
              }}
              variant={'ghost'}
              size={'icon'}>
              <Plus />
            </Button>
          </>
        }
      />
    </Spinner>
  );
}
