import {useEffect, useState} from 'react';
import {useMigrations} from 'drizzle-orm/op-sqlite/migrator';
import migrations from '~/drizzle/migrations';
import {Settings, settingsTable} from '~/db/schema/settings';
import {createSelectSchema} from 'drizzle-zod';
import {drizzle} from 'drizzle-orm/op-sqlite';

type Database = ReturnType<typeof drizzle>;

export function useDatabase(db: Database) {
  const {success, error} = useMigrations(db, migrations);
  const settingsSelectSchema = createSelectSchema(settingsTable);

  const [items, setItems] = useState<Settings[] | undefined>();

  useEffect(() => {
    console.log(items);
  }, [items]);

  useEffect(() => {
    console.log('E: ', error);
  }, [error]);

  useEffect(() => {
    if (!success) {
      console.error('failed to init db');
    }

    (async () => {
      console.log('A');
      const rows = await db.select().from(settingsTable).limit(1);
      console.log('B', rows);
      // if (!row || )
      // const parsed = settingsSelectSchema.parse(rows[0]);
      //
      // console.log(parsed);
      // if (!parsed) {
      //   console.log('!parsed');
      // }
      //
      // setItems([]);
    })();
  }, [success]);

  return {items, success, error};
}
