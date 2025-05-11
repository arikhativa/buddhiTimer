import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Spinner } from '~/components/sheard/Spinner';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { Large, Muted } from '~/components/ui/typography';
import { Timer } from '~/db/schema';
import useTimerListQuery from '~/hooks/useTimerListQuery';
import { Plus } from '~/lib/icons/Plus';
import { sheardStrings } from '~/lib/strings/sheard';
import { formatSeconds } from '~/lib/utils';
import { RootStackParamList } from './Layout';

function Line({
  item,
  navigation,
}: {
  item: Timer;
  navigation: NavigationProp<RootStackParamList>;
}) {
  return (
    <TouchableOpacity
      className="mx-4 py-4 flex-row justify-between items-center"
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
      <View className="flex-1">
        <FlatList
          contentContainerStyle={styles.container}
          data={data}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <Line item={item} navigation={navigation} />
          )}
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
      </View>
    </Spinner>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
});
