import { View } from 'react-native';
import {
  IntervalBellSchema,
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
import { TIMER_WHEEL_EVENT } from '~/app/TimerWheelScreen';
import { sheardStrings } from '~/lib/strings/sheard';
import { INERVAL_BELLS_EVENT } from '~/app/IntervalBellsScreen';
import { useListenValue } from '~/hooks/useListenValue';
import { Input } from '../ui/input';
import { Play } from '~/lib/icons/Play';

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
    defaultValues: isUpdate
      ? data
      : {
          id: BAD_ID,
          duration: 0,
          warmUp: null,
          intervalBells: [],
          name: '',
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

  const sub = (v: number) => {
    const e = entryRef.current;
    if (e) {
      form.setValue(e, v, { shouldValidate: true });
    }
  };

  useListenValue(TIMER_WHEEL_EVENT, sub);

  useListenValue(INERVAL_BELLS_EVENT, (v: IntervalBellSchema[]) => {
    let valToSet = v;
    if (data?.id) {
      valToSet = v.map(e => ({ ...e, timerId: data?.id }));
    }
    form.setValue('intervalBells', valToSet, { shouldValidate: true });
  });

  return (
    <View className="flex-1 px-8 mt-20 gap-4">
      <Form {...form}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-row justify-between items-center">
              <FormLabel>{timerStrings.form.name}</FormLabel>
              <FormControl>
                <Input
                  className="min-w-28 text-center"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field: { value, name } }) => (
            <FormItem className="flex flex-row justify-between items-center">
              <FormLabel>{timerStrings.form.duration}</FormLabel>
              <FormControl>
                <Button
                  className="min-w-28"
                  variant={'outline'}
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
                  variant={'outline'}
                  className="min-w-28"
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
          name="intervalBells"
          render={({ field: { value, name } }) => (
            <FormItem className="flex flex-row justify-between items-center">
              <FormLabel>{timerStrings.form.intervalBells}</FormLabel>
              <FormControl>
                <Button
                  className="min-w-28"
                  variant={'outline'}
                  onPress={() => {
                    setEntry(name);
                    navigation.navigate('IntervalBells', {
                      list: value,
                    });
                  }}>
                  <Text>{bellsText(value.length)}</Text>
                </Button>
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          variant={'outline'}
          onPress={() => {
            submit();
          }}>
          {isUpdate ? (
            <Save className="text-foreground" />
          ) : (
            <Plus className="text-foreground" />
          )}
        </Button>
      </Form>
      <View className="flex-1 flex mb-24 justify-center ">
        <View className="flex justify-center items-center ">
          <Button
            variant={'outline'}
            className="border-primary border-2 shadow-xl shadow-primary rounded-full flex justify-center items-center w-20 !h-20"
            onPress={() => {
              const values = form.getValues();
              const serializedObject = JSON.stringify(values);
              const timerEncoded = encodeURIComponent(serializedObject);

              navigation.navigate('Countdown', { timerEncoded });
            }}>
            <Play className="text-primary" size={30} />
          </Button>
        </View>
      </View>
    </View>
  );
}

function bellsText(len: number): string {
  if (!len) {
    return sheardStrings.none;
  }

  if (len === 1) {
    return timerStrings.form.oneBell;
  }

  return len + ' ' + timerStrings.form.bells;
}
