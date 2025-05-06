import { useMigrations } from 'drizzle-orm/op-sqlite/migrator';
import migrations from '~/drizzle/migrations';

import { drizzle } from 'drizzle-orm/op-sqlite';
import { open, QueryResult } from '@op-engineering/op-sqlite';
import * as schema from '~/db/schema.ts';
import { SQLiteTransaction } from 'drizzle-orm/sqlite-core';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { useLayoutEffect } from 'react';

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
  async function listTables() {
    // {
    //   const result = await db.run(
    //     `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`,
    //   );
    //   console.log('result', result);
    // }
    // {
    //   const result = await db.run(` DROP TABLE __drizzle_migrations`);
    //
    //   console.log('D', result);
    // }
    // {
    //   const result = await db.run(` SELECT * FROM __drizzle_migrations`);
    //   console.log('R', result);
    // }
  }

  useLayoutEffect(() => {
    const f = async () => {
      // await db.run(`DROP TABLE IF EXISTS intervalBell_table`);
      // await db.run(`DROP TABLE IF EXISTS settings_table`);
      // await db.run(`DROP TABLE IF EXISTS timer_table`);
      await listTables();
    };
    f();
  });
  return useMigrations(db, migrations);
}
