import { useMigrations } from 'drizzle-orm/op-sqlite/migrator';
import migrations from '~/drizzle/migrations';

import { drizzle } from 'drizzle-orm/op-sqlite';
import { open } from '@op-engineering/op-sqlite';
import * as schema from '~/db/schema/settings';

const opsqliteDb = open({
  name: 'db',
});

export const db = drizzle(opsqliteDb, { schema });

export function useDatabase() {
  return useMigrations(db, migrations);
}
