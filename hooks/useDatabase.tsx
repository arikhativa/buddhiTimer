import {useEffect, useState} from 'react';
import {useMigrations} from 'drizzle-orm/op-sqlite/migrator';
import migrations from '~/drizzle/migrations';
import {Settings, settingsTable} from '~/db/schema/settings';

import {drizzle} from 'drizzle-orm/op-sqlite';
import {open} from '@op-engineering/op-sqlite';
const opsqliteDb = open({
  name: 'db',
});

const db = drizzle(opsqliteDb);

export function useDatabase() {
  const {success, error} = useMigrations(db, migrations);

  const [settings, setSettings] = useState<Settings | undefined>();

  useEffect(() => {
    if (!success) return;
    (async () => {
      const rows = await db.select().from(settingsTable).limit(1);
      if (!rows || !rows.length) {
        console.error('cant find settings in DB');
        return;
      }

      setSettings(rows[0]);
    })();
  }, [success]);

  return {settings, success, error};
}
