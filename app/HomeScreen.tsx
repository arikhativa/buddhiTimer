import type {StaticScreenProps} from '@react-navigation/native';
import {Sun} from 'lucide-react-native';
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

type Params = {
  username: string;
};

type Props = StaticScreenProps<Params>;

export const initParams: Params = {
  username: 'Pigafetta',
};

export const title = 'Buhddi timer home screen';

export function HomeScreen({route}: Props) {
  return (
    <View className="flex flex-1 justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Home Screen</CardTitle>
          <CardDescription>
            Here you can see all the features {route.params.username}
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-green-500">
          <Text>Here is a timer</Text>
          <Sun color="red" className="color-white" />
        </CardContent>
        <CardFooter>
          <Text>Tax! I want Pigaffeta</Text>
        </CardFooter>
      </Card>
    </View>
  );
}
