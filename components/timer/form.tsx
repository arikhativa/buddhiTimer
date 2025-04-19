import { View } from 'react-native';
import { Settings, settingsKeyword, settingsSchema } from '~/db/schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '../sheard/form';
import { PropsWithChildren } from 'react';
import { settingsScreenString } from '~/lib/strings/settingsScreen';
import { SettingsService } from '~/services/settings';
import useFormSetup from '~/hooks/useFormSetup';

type Props = PropsWithChildren & { data: Settings };

export function TimerForm({ data }: Props) {
  const convertObjectToForm = (obj: Settings): Settings => {
    return obj;
  };

  const { form } = useFormSetup<Settings, Settings>({
    schema: settingsSchema,
    mutate: SettingsService.update,
    convertObjectToForm,
    queryKeyword: settingsKeyword,
    defaultValues: data,
    isAutoSubmit: true,
  });

  return (
    <View className="px-8 mt-20">
      <Form {...form}>
        <FormField
          control={form.control}
          name="theme"
          render={({ field: { onChange, value } }) => (
            <FormItem className="flex flex-row justify-between items-center">
              <FormLabel>{settingsScreenString.form.theme.title}</FormLabel>
              <FormControl />
            </FormItem>
          )}
        />
      </Form>
    </View>
  );
}
