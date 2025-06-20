import { relations } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
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

export const intervalBellSchema = createSelectSchema(intervalBellTable).extend({
  id: z.number(),
  timerId: z.number(),
  duration: z.number(),
});

export const intervalBellCreateSchema = createInsertSchema(intervalBellTable)
  .omit({
    id: true,
  })
  .extend({
    timerId: z.number(),
    duration: z.number(),
  });

export const intervalBellUpdateSchema = createUpdateSchema(intervalBellTable)
  .omit({ timerId: true })
  .extend({
    id: z.number(),
    duration: z.number(),
  });

export const intervalBellFormSchema = intervalBellSchema.extend({
  id: z.number().optional(),
  timerId: z.number().positive().optional(),
  duration: z.number(),
});

export const intervalBellMemory = intervalBellSchema
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
export type IntervalBellUpdate = z.input<typeof intervalBellUpdateSchema>;
export type IntervalBellSchema = z.input<typeof intervalBellFormSchema>;
export type IntervalBellMemory = z.input<typeof intervalBellMemory>;

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Timer /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export const timerTable = sqliteTable('timer_table', {
  id: int().primaryKey(),
  duration: int().notNull(),
  warmUp: int(),
  name: text().notNull().default(''),
});

export const timerRelations = relations(timerTable, ({ many }) => ({
  intervalBells: many(intervalBellTable),
}));

export const timerSchema = createSelectSchema(timerTable).extend({
  id: z.number(),
  duration: z.number(),
  warmUp: z.number().nullable(),
  intervalBells: z.array(intervalBellSchema),
  name: z.string().optional(),
});

export const timerMemory = createSelectSchema(timerTable)
  .omit({ id: true })
  .extend({
    duration: z.number(),
    warmUp: z.number().nullable(),
    intervalBells: z.array(intervalBellMemory),
    name: z.string().optional(),
  });

export const timerCreateSchema = createInsertSchema(timerTable)
  .omit({
    id: true,
  })
  .extend({
    duration: z.number(),
    warmUp: z.number().nullable(),
    intervalBells: z.array(intervalBellFormSchema),
    name: z.string().optional(),
  });

export const timerUpdateSchema = createUpdateSchema(timerTable).extend({
  id: z.number(),
  duration: z.number(),
  warmUp: z.number().nullable(),
  intervalBells: z.array(intervalBellFormSchema),
  name: z.string().optional(),
});

export const timerKeyword = 'timer';

export type Timer = z.input<typeof timerSchema>;
export type TimerCreate = z.input<typeof timerCreateSchema>;
export type TimerUpdate = z.input<typeof timerUpdateSchema>;
export type TimerMemory = z.input<typeof timerMemory>;
