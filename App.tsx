import React, {useEffect, useState} from 'react';
import './global.css';
import {useColorScheme} from 'nativewind';
import RootLayout from './app/_layout';
import {open} from '@op-engineering/op-sqlite';
import {useMigrations} from 'drizzle-orm/op-sqlite/migrator';
import {drizzle} from 'drizzle-orm/op-sqlite';
import migrations from './drizzle/migrations';
import {usersTable} from './db/schema';
import {View} from 'react-native';
import {Text} from './components/ui/text';

const opsqliteDb = open({
  name: 'db',
});

const db = drizzle(opsqliteDb);

function App(): React.JSX.Element {
  const {success, error} = useMigrations(db, migrations);
  const [items, setItems] = useState<(typeof usersTable.$inferSelect)[] | null>(
    null,
  );

  const {setColorScheme} = useColorScheme();

  setColorScheme('dark');

  useEffect(() => {
    if (!success) return;
    (async () => {
      await db.delete(usersTable);
      await db.insert(usersTable).values([
        {
          name: 'John',
          age: 30,
          email: 'john@example.com',
        },
      ]);
      const users = await db.select().from(usersTable);
      setItems(users);
      console.log(users);
    })();
  }, [success]);

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

  if (items === null || items.length === 0) {
    return (
      <View>
        <Text>Empty</Text>
      </View>
    );
  }

  return <RootLayout />;
}

export default App;
