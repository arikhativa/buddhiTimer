import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ID = 1;

export const settingsTable = sqliteTable('settings_table', {
  id: int()
    .primaryKey()
    .$default(() => ID),
  theme: text('theme', {
    enum: ['dark', 'light', 'system'],
  })
    .notNull()
    .default('system'),
});

export const settingsSchema = createSelectSchema(settingsTable).omit({
  id: true,
});

export const settingsKeyword = 'settings';
export type Settings = z.input<typeof settingsSchema>;
