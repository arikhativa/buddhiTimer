import {PropsWithChildren} from 'react';
import {View} from 'react-native';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {Text} from '~/components/ui/text';
import {Bug} from '~/lib/icons/Bug';
import {PackagePlus} from '~/lib/icons/PackagePlus';
import {errorScreenString} from '~/lib/strings/errorScreen';

type Props = PropsWithChildren & {};

export function ErrorScreen({}: Props) {
  return (
    <View className="flex-1 items-center justify-center">
      <Card className="max-w-sm">
        <CardHeader>
          <View className="flex flex-row justify-between">
            <CardTitle>{errorScreenString.title}</CardTitle>
            <Bug />
          </View>
          <CardDescription>{errorScreenString.desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>{errorScreenString.content}</Text>
          <PackagePlus className="mt-4" />
        </CardContent>
        <CardFooter>
          <Text>{errorScreenString.footer}</Text>
        </CardFooter>
      </Card>
    </View>
  );
}
