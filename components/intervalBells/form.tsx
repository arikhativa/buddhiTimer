import { useFieldArray, useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { IntervalBellSchema, intervalBellFormSchema } from '~/db/schema';
import { Large, Muted } from '../ui/typography';
import { Plus } from '~/lib/icons/Plus';
import { Button } from '../ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Separator } from '../ui/separator';
import { sheardStrings } from '~/lib/strings/sheard';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '~/app/Layout';
import { INTERVAL_BELL_EVENT } from '~/app/IntervalBellScreen';
import { useListenValue } from '~/hooks/useListenValue';
import { formatSeconds } from '~/lib/utils';
import { timerStrings } from '~/lib/strings/timer';
import { useAlert } from '~/hooks/useAlert';
import { AlertDeleteItem } from '../sheard/AlertDeleteItem';
import { Line } from '../sheard/Line';

type Props = {
  value: IntervalBellSchema[];
  onChange: (value: IntervalBellSchema[]) => void;
};

const schema = z.object({
  list: z.array(intervalBellFormSchema),
});

function Item({ item }: { item: IntervalBellSchema }) {
  const reference =
    item.reference === 'fromStart'
      ? timerStrings.intervalBells.refrance.start
      : timerStrings.intervalBells.refrance.end;

  return (
    <>
      <Large>{formatSeconds(item.duration)}</Large>
      <Muted>{reference}</Muted>
    </>
  );
}

export function IntervalBellsForm({ value, onChange }: Props) {
  const navigation = useNavigation();

  const {
    reset,
    formState: { isValid, isDirty },
    handleSubmit,
    control,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { list: value },
  });

  const submit = handleSubmit(
    values => {
      const cleaned = values.list.map(({ id, duration, reference }) => ({
        ...(id !== undefined ? { id } : {}),
        duration,
        reference,
      }));
      onChange(cleaned);
      reset({ list: cleaned });
    },
    errors => {
      console.error('IntervalBellsForm', errors);
    },
  );

  useEffect(() => {
    if (isValid && isDirty) {
      submit();
    }
  }, [isDirty, isValid, submit]);

  const { fields, append, update, remove } = useFieldArray({
    control: control,
    name: 'list',
  });

  const [entry, setEntry] = useState<number | undefined>();

  const entryRef = useRef(entry);

  useEffect(() => {
    entryRef.current = entry;
  }, [entry]);

  const handleEvent = useCallback(
    (v: IntervalBellSchema) => {
      delete v.id;
      const i = entryRef.current;

      if (i !== undefined) {
        update(i, v);
      }
    },
    [update],
  );

  useListenValue(INTERVAL_BELL_EVENT, handleEvent);

  const { open, toggleOpen } = useAlert();
  const [indexToDel, setIndexToDel] = useState<number | undefined>();

  return (
    <View>
      <View>
        {!fields.length && (
          <>
            <Muted className="my-4 self-center">{sheardStrings.empty}</Muted>
            <Separator className="mx-5 w-fit" />
          </>
        )}
        {fields.map((field, index) => (
          <View key={field.id}>
            <Line
              index={index}
              onLongPress={i => {
                setIndexToDel(i);
                toggleOpen();
              }}
              onPress={() => {
                setEntry(index);
                navigation.navigate('IntervalBell', { value: field });
              }}>
              <Item item={field} />
            </Line>
            <Separator className="mx-5 w-fit" />
          </View>
        ))}
      </View>
      <Button
        className="mt-4"
        variant={'ghost'}
        onPress={() => {
          append({ duration: 0, reference: 'fromStart' });
        }}>
        <Plus />
      </Button>
      <AlertDeleteItem
        open={open}
        toggleOpen={toggleOpen}
        onConfirm={() => remove(indexToDel)}
      />
    </View>
  );
}
