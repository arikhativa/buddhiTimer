import { useFieldArray, useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { IntervalBellSchema, intervalBellFormSchema } from '~/db/schema';
import { Large, Muted } from '../ui/typography';
import { Plus } from '~/lib/icons/Plus';
import { Button } from '../ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Separator } from '../ui/separator';
import { sheardStrings } from '~/lib/strings/sheard';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '~/app/Layout';

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
}: {
  item: IntervalBellSchema;
  navigation: NavigationProp<RootStackParamList>;
}) {
  return (
    <TouchableOpacity
      className="mx-4 py-4 flex-row justify-between items-center"
      onPress={() =>
        navigation.navigate('IntervalBellExpanded', { value: item })
      }>
      <Large>{item.duration}</Large>
      <Muted>{item.reference}</Muted>
    </TouchableOpacity>
  );
}

export function IntervalBellsForm({ value, onChange }: Props) {
  const navigation = useNavigation();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { list: value },
  });

  const watch = form.watch('list');

  useEffect(() => {
    onChange(watch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  const { fields, append } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'list', // unique name for your Field Array
  });

  return (
    <View>
      <View>
        {!fields.length && (
          <>
            <Muted className="my-4 self-center">{sheardStrings.empty}</Muted>
            <Separator className="mx-5 w-fit" />
          </>
        )}
        {fields.map(field => (
          <View key={field.id}>
            <Item item={field} navigation={navigation} />

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
    </View>
  );
}
