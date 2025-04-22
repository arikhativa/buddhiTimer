import { View } from 'react-native';
import { Timer, timerKeyword, timerSchema, TimerUpdate } from '~/db/schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '../sheard/form';
import { PropsWithChildren } from 'react';
import { TimerService } from '~/services/timer';
import useFormSetup from '~/hooks/useFormSetup';
import InputNumber from '../sheard/InputNumber';
import { Text } from '../ui/text';

type Props = PropsWithChildren & { data?: Timer };

export function TimerForm({ data }: Props) {
  const convertObjectToForm = (obj: TimerUpdate): TimerUpdate => {
    return obj;
  };

  const { form } = useFormSetup<TimerUpdate, TimerUpdate>({
    schema: timerSchema,
    mutate: TimerService.update,
    convertObjectToForm,
    queryKeyword: timerKeyword,
    defaultValues: data || {
      duration: 0,
    },
    isAutoSubmit: true,
  });

  return (
    <View className="px-8 mt-20">
      <Form {...form}>
        <FormField
          control={form.control}
          name="duration"
          render={({ field: { onChange, value } }) => (
            <FormItem className="flex flex-row justify-between items-center">
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <InputNumber onChange={onChange} value={value} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="warmUp"
          render={({ field: { onChange, value } }) => (
            <FormItem className="flex flex-row justify-between items-center">
              <FormLabel>warmUp</FormLabel>
              <FormControl>
                {value !== null ? (
                  <InputNumber onChange={onChange} value={value} />
                ) : (
                  <Text> no warmup</Text>
                )}
              </FormControl>
            </FormItem>
          )}
        />
      </Form>
    </View>
  );
}
