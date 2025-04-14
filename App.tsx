import './global.css';
import {useColorScheme} from 'nativewind';
import RootLayout from './app/_layout';
import {View} from 'react-native';
import {Text} from './components/ui/text';
import {useDatabase} from './hooks/useDatabase';
import {drizzle} from 'drizzle-orm/op-sqlite';
import {open} from '@op-engineering/op-sqlite';

const opsqliteDb = open({
  name: 'db',
});

const db = drizzle(opsqliteDb);

function App(): React.JSX.Element {
  const {items, success, error} = useDatabase(db);

  const {setColorScheme} = useColorScheme();

  setColorScheme('dark');

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  if (!items || items.length === 0) {
    console.log('No items');
    return (
      <View>
        <Text className="bg-zinc-900">Empty</Text>
      </View>
    );
  }

  return <RootLayout />;
}

export default App;
