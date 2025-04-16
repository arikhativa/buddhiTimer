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
    <Form {...form}>
      <View className="space-y-8">
        <FormField
          control={form.control}
          name="theme"
          render={({field: {onChange, onBlur, value}}) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <FormControl>
                <Input
                  placeholder="Select theme"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </FormControl>
              <FormDescription>
                This will change your app theme.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button onPress={form.handleSubmit(onSubmit)}>
          <Text>Submit</Text>
        </Button>
      </View>
    </Form>
  );
}
