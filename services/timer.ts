import { eq } from 'drizzle-orm';
import {
  IntervalBellCreate,
  Timer,
  TimerCreate,
  TimerUpdate,
  timerCreateSchema,
  timerSchema,
  timerTable,
  timerUpdateSchema,
} from '~/db/schema';
import { db, Transaction } from '~/hooks/useDatabase';
import { IntervalBellService } from './intervalBell';
import { z } from 'zod';

export class TimerService {
  static async getById(id: number, tx?: Transaction): Promise<Timer> {
    const src = tx || db;
    const raw = await src.query.timerTable.findFirst({
      where: timer => eq(timer.id, id),
      with: {
        intervalBells: true,
      },
    });

    return timerSchema.parse(raw);
  }

  static async getMany(tx?: Transaction): Promise<Timer[]> {
    const src = tx || db;
    const raw = await src.query.timerTable.findMany({
      with: {
        intervalBells: true,
      },
    });

    return z.array(timerSchema).parse(raw);
  }

  static async create(obj: TimerCreate): Promise<Timer> {
    const parsed = timerCreateSchema.parse(obj);

    return db.transaction(async tx => {
      const ret = await tx
        .insert(timerTable)
        .values(parsed)
        .returning({ id: timerTable.id });

      if (!ret || !ret.length || !ret[0].id) {
        throw new Error('Failed to create');
      }

      if (parsed.intervalBells && parsed.intervalBells.length) {
        const createList: IntervalBellCreate[] = parsed.intervalBells.map(
          e => ({ ...e, timerId: ret[0].id }),
        );
        await IntervalBellService.create(createList, tx);
      }

      const result = await TimerService.getById(ret[0].id, tx);
      if (!result) {
        throw new Error('Failed to retrieve object');
      }
      return result;
    });
  }

  static async update(obj: TimerUpdate): Promise<Timer> {
    const parsed = timerUpdateSchema.parse(obj);

    return db.transaction(async tx => {
      const ret = await tx
        .update(timerTable)
        .set(parsed)
        .where(eq(timerTable.id, obj.id))
        .returning();

      if (!ret || !ret.length) {
        throw new Error(`Failed to update id: ${obj.id}`);
      }

      await IntervalBellService.upsert(parsed.intervalBells, obj.id, tx);

      const result = await TimerService.getById(obj.id, tx);

      if (!result) {
        throw new Error('Failed to retrieve object');
      }

      return result;
    });
  }

  static async delete(id: Timer['id']): Promise<void> {
    await db.transaction(async tx => {
      const obj = await TimerService.getById(id, tx);

      const ret = await tx
        .delete(timerTable)
        .where(eq(timerTable.id, id))
        .returning();

      if (!ret || !ret.length) {
        throw new Error('Failed to delete');
      }

      await IntervalBellService.delete(
        obj.intervalBells.map(e => e.id),
        tx,
      );
    });
  }
}
