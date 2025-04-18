import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import {
  Settings,
  settingsKeyword,
  settingsSchema,
} from '~/db/schema/settings';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '../sheard/form';
import SelectTheme from './SelectTheme';
import { PropsWithChildren, useEffect } from 'react';
import { settingsScreenString } from '~/lib/strings/settingsScreen';
import { SettingsService } from '~/services/settings';
import {
  MutationFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

type Props = PropsWithChildren & { data: Settings };
export function SettingsForm({ data }: Props) {
  const form = useForm<Settings>({
    resolver: zodResolver(settingsSchema),
    defaultValues: data,
  });

  const queryClient = useQueryClient();

  const mutationFn: MutationFunction<Settings, Settings> = async (
    values: Settings,
  ) => {
    return SettingsService.update(values);
  };

  const onSuccess = (freshData: Settings) => {
    if (freshData) {
      form.reset(freshData);
    }
    queryClient.invalidateQueries({ queryKey: [settingsKeyword] });
  };

  const mutation = useMutation({
    mutationFn,
    // TODO: add indecator
    onError: e => {
      console.error('submit form error:', e);
    },
    onSuccess,
    retry: 1,
    retryDelay: 1000,
  });

  const isDirty = form.formState.isDirty;

  const submit = form.handleSubmit(values => mutation.mutate(values));

  useEffect(() => {
    if (isDirty) {
      submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  return (
    <View className="px-8 mt-20">
      <Form {...form}>
        <FormField
          control={form.control}
          name="theme"
          render={({ field: { onChange, value } }) => (
            <FormItem className="flex flex-row justify-between items-center">
              <FormLabel>{settingsScreenString.form.theme.title}</FormLabel>
              <FormControl>
                <SelectTheme value={value} onChange={onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </Form>
    </View>
  );
}
