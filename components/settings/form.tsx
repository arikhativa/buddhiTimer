import {PropsWithChildren} from 'react';
import {View} from 'react-native';
import {Button} from '~/components/ui/button';
import {Text} from '~/components/ui/text';
import {SettingsService} from '~/services/settings';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {SettingsUpdate, settingsUpdateSchema} from '~/db/schema/settings';
import {Input} from '../ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../general/form';
import SelectTheme from './SelectTheme';
type Props = PropsWithChildren & {data: SettingsUpdate};

export function SettingsForm({data}: Props) {
  const form = useForm<SettingsUpdate>({
    resolver: zodResolver(settingsUpdateSchema),
    defaultValues: data,
  });

  function onSubmit(values: SettingsUpdate) {
    console.log(values);
  }

  return (
    <View className="px-4">
      <Form {...form}>
        <FormField
          control={form.control}
          name="theme"
          render={({field: {onChange, onBlur, value}}) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <FormControl>
                <SelectTheme />
              </FormControl>
              <FormDescription>
                This will change your app theme.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
      <Button onPress={form.handleSubmit(onSubmit)}>
        <Text>Submit</Text>
      </Button>
    </View>
  );
}
// <Input
//   placeholder="Select theme"
//   onBlur={onBlur}
//   onChangeText={onChange}
//   value={value}
// />
