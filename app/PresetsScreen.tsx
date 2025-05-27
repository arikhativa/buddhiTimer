import { useNavigation } from '@react-navigation/native';
import { FlatList, StyleSheet, View } from 'react-native';
import { Spinner } from '~/components/sheard/Spinner';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { Large, Muted } from '~/components/ui/typography';
import useTimerListQuery from '~/hooks/useTimerListQuery';
import { Plus } from '~/lib/icons/Plus';
import { sheardStrings } from '~/lib/strings/sheard';
import { formatSeconds } from '~/lib/utils';
import { AlertDeleteItem } from '~/components/sheard/AlertDeleteItem';
import { useAlert } from '~/hooks/useAlert';
import { useEffect, useState } from 'react';
import { Line } from '~/components/sheard/Line';
import { TimerService } from '~/services/timer';
import { useQueryClient } from '@tanstack/react-query';

import { timerKeyword } from '~/db/schema';
export function PresetsScreen() {
  const navigation = useNavigation();
  const query = useTimerListQuery();
  const { data } = query;

  const { open, toggleOpen } = useAlert();
  const [idToDelete, setIdToDelete] = useState<number | undefined>();

  const queryClient = useQueryClient();

  const invalid = () => {
    queryClient.refetchQueries({ queryKey: [timerKeyword] });
  };

  return (
    <Spinner query={query}>
      <View className="flex-1">
        <FlatList
          contentContainerStyle={styles.container}
          data={data}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item, index }) => (
            <Line
              index={index}
              onPress={() => navigation.navigate('Timer', { id: item.id })}
              onLongPress={() => {
                setIdToDelete(item.id);
                toggleOpen();
              }}>
              <>
                <Large>{item.id}</Large>
                <Muted>{formatSeconds(item.duration)}</Muted>
              </>
            </Line>
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
      <AlertDeleteItem
        open={open}
        toggleOpen={toggleOpen}
        onConfirm={async () => {
          if (idToDelete !== undefined) {
            await TimerService.delete(idToDelete);
            invalid();
          }
        }}
      />
    </Spinner>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
});
