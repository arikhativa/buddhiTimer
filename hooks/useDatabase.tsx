import {useEffect, useState} from 'react';
import {open} from '@op-engineering/op-sqlite';
import {useMigrations} from 'drizzle-orm/op-sqlite/migrator';
import {drizzle} from 'drizzle-orm/op-sqlite';
import migrations from '~/drizzle/migrations';
import {settingsTable} from '~/db/schema/settings';

const opsqliteDb = open({
  name: 'db',
});

const db = drizzle(opsqliteDb);

export function useDatabase() {
  const {success, error} = useMigrations(db, migrations);
  const [items, setItems] = useState<
    (typeof settingsTable.$inferSelect)[] | null
  >(null);

  useEffect(() => {
    if (!success) return;
    (async () => {
      const users = await db.select().from(settingsTable);
      setItems(users);
      console.log(users);
    })();
  }, [success]);

  return {items, success, error};
}
