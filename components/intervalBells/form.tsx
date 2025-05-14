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
import { Sun } from '~/lib/icons/Sun';

type Props = {
  value: IntervalBellSchema[];
  onChange: (value: IntervalBellSchema[]) => void;
};

const schema = z.object({
  list: z.array(intervalBellFormSchema),
});

function Item({
  item,
  navigation,
  index,
  onSelect,
}: {
  item: IntervalBellSchema;
  navigation: NavigationProp<RootStackParamList>;
  index: number;
  onSelect: (i: number) => void;
}) {
  const reference =
    item.reference === 'fromStart'
      ? timerStrings.intervalBells.refrance.start
      : timerStrings.intervalBells.refrance.end;

  return (
    <TouchableOpacity
      className="mx-4 py-4 flex-row justify-between items-center"
      onPress={() => {
        onSelect(index);
        navigation.navigate('IntervalBell', { value: item });
      }}>
      <Large>{formatSeconds(item.duration)}</Large>
      <Muted>{reference}</Muted>
    </TouchableOpacity>
  );
}

export function IntervalBellsForm({ value, onChange }: Props) {
  const navigation = useNavigation();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { list: value },
  });

  // const watch = form.watch('list');

  // const submit = form.handleSubmit(
  //   values => {
  //     console.log('values', values);
  //     onChange(values.list);
  //   },
  //   e => {
  //     console.log('sub erre', e);
  //   },
  // );

  const submit = form.handleSubmit(
    values => {
      console.log('values', values);

      const cleaned = values.list.map(({ id, duration, reference }) => ({
        ...(id !== undefined ? { id } : {}),
        duration,
        reference,
      }));
      onChange(cleaned);
    },
    errors => {
      console.log('❌ validation errors', errors);
    },
  );

  // useEffect(() => {
  //   if (form.formState.isDirty) {
  //     console.log('submit');
  //     submit();
  //     console.log('ee', form.formState.errors);
  //   }
  // }, [form.formState.isDirty, submit]);
  //
  const { fields, append, update } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'list', // unique name for your Field Array
  });

  const [entry, setEntry] = useState<number | undefined>();

  const entryRef = useRef(entry);

  useEffect(() => {
    entryRef.current = entry;
  }, [entry]);

  const handleEvent = useCallback(
    (v: IntervalBellSchema) => {
      delete v.id
      const i = entryRef.current;

      if (i !== undefined) {
        update(i, v);
      }
    },
    [update],
  );

  useListenValue(INTERVAL_BELL_EVENT, handleEvent);

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
            <Item
              item={field}
              navigation={navigation as NavigationProp<RootStackParamList>}
              index={index}
              onSelect={setEntry}
            />

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
      <Button
        className="mt-4"
        variant={'ghost'}
        onPress={() => {
          const val = form.getValues().list;
          console.log('val', val);
          submit();
        }}>
        <Sun />
      </Button>
    </View>
  );
}
