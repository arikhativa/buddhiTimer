import { useMigrations } from 'drizzle-orm/op-sqlite/migrator';
import migrations from '~/drizzle/migrations';

import { drizzle } from 'drizzle-orm/op-sqlite';
import { open, QueryResult } from '@op-engineering/op-sqlite';
import * as schema from '~/db/schema.ts';
import { SQLiteTransaction } from 'drizzle-orm/sqlite-core';
import { ExtractTablesWithRelations } from 'drizzle-orm';

export type Transaction = SQLiteTransaction<
  'async',
  QueryResult,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

const opsqliteDb = open({
  name: 'db',
});

export const db = drizzle(opsqliteDb, { schema });

export function useDatabase() {
  return useMigrations(db, migrations);
}
