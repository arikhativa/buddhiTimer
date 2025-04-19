import { relations } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ID = 1;

////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// Settings ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IntervalBell //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export const intervalBellTable = sqliteTable('intervalBell_table', {
  id: int().primaryKey(),
  reference: text({
    enum: ['fromStart', 'beforeEnd'],
  })
    .notNull()
    .default('fromStart'),
  duration: int().notNull(),
  timerId: int()
    .notNull()
    .references(() => timerTable.id, { onDelete: 'cascade' }),
});

export const intervalBellRelations = relations(
  intervalBellTable,
  ({ one }) => ({
    timer: one(timerTable, {
      fields: [intervalBellTable.timerId],
      references: [timerTable.id],
    }),
  }),
);

export const intervalBellSchema = createSelectSchema(intervalBellTable)
  .omit({
    timerId: true,
  })
  .extend({
    id: z.number(),
    duration: z.number(),
  });

export const intervalBellCreateSchema = createInsertSchema(intervalBellTable)
  .omit({
    id: true,
    timerId: true,
  })
  .extend({
    duration: z.number(),
  });

export const intervalBellKeyword = 'intervalBell';

export type IntervalBell = z.input<typeof intervalBellSchema>;
export type IntervalBellCreate = z.input<typeof intervalBellCreateSchema>;

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Timer /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export const timerTable = sqliteTable('timer_table', {
  id: int().primaryKey(),
  duration: int().notNull(),
  warmUp: int(),
});

export const timerRelations = relations(timerTable, ({ many }) => ({
  intervalBells: many(intervalBellTable),
}));

export const timerSchema = createSelectSchema(timerTable).extend({
  id: z.number(),
  duration: z.number(),
  warmUp: z.number().optional(),
  intervalBells: z.array(intervalBellSchema),
});

export const timerCreateSchema = createInsertSchema(timerTable)
  .omit({
    id: true,
  })
  .extend({
    duration: z.number(),
    warmUp: z.number().optional(),
    intervalBells: z.array(intervalBellCreateSchema),
  });

export const timerKeyword = 'timer';

export type Timer = z.input<typeof timerSchema>;
export type TimerCreate = z.input<typeof timerCreateSchema>;
