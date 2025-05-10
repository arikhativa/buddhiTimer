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
import { useEffect, PropsWithChildren, useRef, useState } from 'react';
import { TimerService } from '~/services/timer';
import useFormSetup from '~/hooks/useFormSetup';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { Plus } from '~/lib/icons/Plus';
import { Save } from '~/lib/icons/Save';
import { useNavigation } from '@react-navigation/native';
import { BAD_ID } from '~/lib/constants';
import { timerStrings } from '~/lib/strings/timer';
import TimerMenu from './TimerMenu';
import { formatSeconds } from '~/lib/utils';
import { EVENT_ID } from '~/app/TimerWheelScreen';

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

  const [entry, setEntry] = useState<keyof FormType | undefined>();

  const entryRef = useRef(entry);

  useEffect(() => {
    entryRef.current = entry;
  }, [entry]);

  useEffect(() => {
    const sub = (v: number) => {
      const e = entryRef.current;
      if (e) {
        form.setValue(e, v, { shouldValidate: true });
      }
    };
    eventEmitter.on(EVENT_ID, sub);

    return () => {
      eventEmitter.off(EVENT_ID);
    };
  }, []);

  return (
    <View className="px-8 mt-20 gap-4">
      <Form {...form}>
        <FormField
          control={form.control}
          name="duration"
          render={({ field: { value, name } }) => (
            <FormItem className="flex flex-row justify-between items-center">
              <FormLabel>{timerStrings.form.duration}</FormLabel>
              <FormControl>
                <Button
                  onPress={() => {
                    setEntry(name);
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
          render={({ field: { value, name } }) => (
            <FormItem className="flex flex-row justify-between items-center">
              <FormLabel>{timerStrings.form.warmUp}</FormLabel>
              <FormControl>
                <Button
                  onPress={() => {
                    setEntry(name);
                    navigation.navigate('TimerWheel', { value: value });
                  }}>
                  <Text>{formatSeconds(value)}</Text>
                </Button>
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
