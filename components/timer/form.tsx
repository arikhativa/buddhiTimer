import { View } from 'react-native';
import { eventEmitter } from '~/lib/events';
import {
  Timer,
  TimerCreate,
  timerCreateSchema,
  timerKeyword,
  TimerUpdate,
  timerUpdateSchema,
} from '~/db/schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '../sheard/form';
import { useEffect, PropsWithChildren } from 'react';
import { TimerService } from '~/services/timer';
import useFormSetup from '~/hooks/useFormSetup';
import InputNumber from '../sheard/InputNumber';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { Plus } from '~/lib/icons/Plus';
import { Save } from '~/lib/icons/Save';
import { useNavigation } from '@react-navigation/native';
import { BAD_ID } from '~/lib/constants';
import { timerStrings } from '~/lib/strings/timer';
import TimerMenu from './TimerMenu';
import { formatSeconds } from '~/lib/utils';

type Props = PropsWithChildren & { data?: Timer };
type FormType = TimerUpdate | TimerCreate;

export function TimerForm({ data }: Props) {
  const navigation = useNavigation();
  const isUpdate = !!data;

  const handleOnSuccess = (obj: Timer) => {
    navigation.navigate('Timer', { id: obj.id });
  };

  const mutate = (v: FormType) => {
    if (isUpdate) {
      return TimerService.update(v as TimerUpdate);
    } else {
      return TimerService.create(v as TimerCreate);
    }
  };

  const { form, submit, deleteMutation } = useFormSetup<FormType, Timer>({
    schema: isUpdate ? timerUpdateSchema : timerCreateSchema,
    mutate,
    onDelete: (obj: Timer) => TimerService.delete(obj.id),
    queryKeyword: timerKeyword,
    defaultValues: data || {
      id: BAD_ID,
      duration: 0,
      warmUp: null,
      intervalBells: [],
    },
    isAutoSubmit: false,
    handleOnSuccess,
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: isUpdate
        ? () => <TimerMenu onDelete={() => deleteMutation.mutate(data)} />
        : undefined,
    });
  }, [isUpdate, data?.id, navigation]);

  useEffect(() => {
    const sub = (v: number) => {
      form.setValue('duration', v, { shouldValidate: true });
    };
    eventEmitter.on('timerWheelValue', sub);

    return () => {
      eventEmitter.off('timerWheelValue');
    };
  }, []);

  return (
    <View className="px-8 mt-20">
      <Form {...form}>
        <FormField
          control={form.control}
          name="duration"
          render={({ field: { value } }) => (
            <FormItem className="flex flex-row justify-between items-center">
              <FormLabel>{timerStrings.form.duration}</FormLabel>
              <FormControl>
                <Button
                  onPress={() => {
                    navigation.navigate('TimerWheel', { value: value });
                  }}>
                  <Text>{formatSeconds(value)}</Text>
                </Button>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="warmUp"
          render={({ field: { onChange, value } }) => (
            <FormItem className="flex flex-row justify-between items-center">
              <FormLabel>{timerStrings.form.warmUp}</FormLabel>
              <FormControl>
                {value !== null ? (
                  <InputNumber onChange={onChange} value={value} />
                ) : (
                  <Text> {timerStrings.form.missingWarmUp}</Text>
                )}
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          variant={'outline'}
          onPress={() => {
            if (!form.formState.isValid) {
              console.log('form.formState.errors', form.formState.errors);
            }
            submit();
          }}>
          {isUpdate ? <Save /> : <Plus />}
        </Button>
      </Form>
    </View>
  );
}
