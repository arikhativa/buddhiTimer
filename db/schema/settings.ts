import {int, sqliteTable, text} from 'drizzle-orm/sqlite-core';

import {InferSelectModel} from 'drizzle-orm';

export const settingsTable = sqliteTable('settings_table', {
  id: int()
    .primaryKey()
    .$default(() => 1),
  theme: text('theme', {
    enum: ['dark', 'light', 'system'],
  })
    .notNull()
    .default('system'),
});

export type Settings = InferSelectModel<typeof settingsTable>;
