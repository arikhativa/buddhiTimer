import { eq } from 'drizzle-orm';
import { z } from 'zod';
import {
  IntervalBell,
  IntervalBellCreate,
  intervalBellCreateSchema,
  intervalBellTable,
  intervalBellUpdateSchema,
} from '~/db/schema';
import { db, Transaction } from '~/hooks/useDatabase';

export class IntervalBellService {
  static async create(
    timerId: number,
    objs: IntervalBellCreate[],
    ts?: Transaction,
  ): Promise<void> {
    const parsed = z
      .array(intervalBellCreateSchema)
      .parse(objs.map(e => ({ ...e, timerId })));

    const src = ts || db;

    const ret = await src
      .insert(intervalBellTable)
      .values(parsed)
      .returning({ id: intervalBellTable.id });

    if (!ret || !ret.length) {
      throw new Error('Failed to create');
    }
  }

  static async update(
    id: IntervalBell['id'],
    obj: IntervalBell,
  ): Promise<IntervalBell | undefined> {
    const parsed = intervalBellUpdateSchema.parse(obj);

    return db.transaction(async tx => {
      const updated = await tx
        .update(intervalBellTable)
        .set(parsed)
        .where(eq(intervalBellTable.id, id))
        .returning();

      return result;
    });
  }
}
