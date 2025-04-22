import { useMigrations } from 'drizzle-orm/op-sqlite/migrator';
import migrations from '~/drizzle/migrations';

import { drizzle } from 'drizzle-orm/op-sqlite';
import { open, QueryResult } from '@op-engineering/op-sqlite';
import * as schema from '~/db/schema.ts';
import { SQLiteTransaction } from 'drizzle-orm/sqlite-core';
import { ExtractTablesWithRelations } from 'drizzle-orm';
// import { useEffect, useLayoutEffect } from 'react';

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
  // async function listTables() {
  //   const result = await db.run(
  //     `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`,
  //   );
  //
  //   // `result` is a raw object; structure depends on op-sqlite. Here's how you might extract the names:
  //   const tableNames = result.rows.map((row: any) => row.name);
  //   console.log('Tables:', tableNames);
  //   return tableNames;
  // }
  //
  // useLayoutEffect(() => {
  //   const f = async () => {
  //     console.log('A');
  //     await db.run(`DROP TABLE IF EXISTS intervalBell_table`);
  //     await db.run(`DROP TABLE IF EXISTS settings_table`);
  //     await db.run(`DROP TABLE IF EXISTS timer_table`);
  //     console.log('Done');
  //     await listTables();
  //   };
  //   f();
  // });
  return useMigrations(db, migrations);
}
