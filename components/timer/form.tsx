import { View } from 'react-native';
import {
  Timer,
  TimerCreate,
  timerKeyword,
  timerSchema,
  TimerUpdate,
} from '~/db/schema';
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
import { Button } from '../ui/button';
import { Plus } from '~/lib/icons/Plus';

type Props = PropsWithChildren & { data?: Timer };
type FormType = TimerCreate | TimerUpdate;

export function TimerForm({ data }: Props) {
  const convertObjectToForm = (obj: FormType): FormType => {
    return obj;
  };

  const mutate = (v: FormType) => {
    if (data) {
      return TimerService.update(v as TimerUpdate) as Promise<FormType>;
    } else {
      return TimerService.create(v as TimerCreate) as Promise<FormType>;
    }
  };

  const { form, submit } = useFormSetup<FormType, FormType>({
    schema: timerSchema,
    mutate,
    convertObjectToForm,
    queryKeyword: timerKeyword,
    defaultValues: data || {
      id: 0,
      duration: 0,
      warmUp: null,
      intervalBells: [],
    },
    isAutoSubmit: false,
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
        <Button
          onPress={() => {
            if (form.formState.errors) {
              console.error('form.formState.errors', form.formState.errors);
            }
            submit();
          }}>
          <Plus />
        </Button>
      </Form>
    </View>
  );
}
