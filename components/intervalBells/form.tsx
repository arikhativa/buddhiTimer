import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { View } from 'react-native';
import { IntervalBellSchema, intervalBellFormSchema } from '~/db/schema';
import { H1 } from '../ui/typography';
import { Plus } from '~/lib/icons/Plus';
import { Button } from '../ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

type Props = {
  value: IntervalBellSchema[];
  onChange: (value: IntervalBellSchema[]) => void;
};

const schema = z.object({
  list: z.array(intervalBellFormSchema),
});

export function IntervalBellsForm({ value, onChange }: Props) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { list: value },
  });

  const watch = form.watch('list');

  useEffect(() => {
    onChange(watch);
  }, [watch]);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
      name: 'list', // unique name for your Field Array
    },
  );

  return (
    <View>
      <View>
        {fields.map((field, index) => (
          <View key={field.id}>
            <H1>{index}</H1>
            <H1>{field.duration}</H1>
          </View>
        ))}
      </View>

      <Button
        variant={'outline'}
        onPress={() => {
          append({ duration: 0, reference: 'fromStart' });
        }}>
        <Plus />
      </Button>
    </View>
  );
}
