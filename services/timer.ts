import { eq } from 'drizzle-orm';
import {
  Timer,
  TimerCreate,
  timerCreateSchema,
  timerSchema,
  timerTable,
  timerUpdateSchema,
} from '~/db/schema';
import { db, Transaction } from '~/hooks/useDatabase';

export class TimerService {
  static async getById(
    id: number,
    tx?: Transaction,
  ): Promise<Timer | undefined> {
    const src = tx || db;
    const raw = await src.query.timerTable.findFirst({
      where: timer => eq(timer.id, id),
      with: {
        intervalBells: true,
      },
    });

    return timerSchema.parse(raw);
  }

  static async create(obj: TimerCreate): Promise<Timer | undefined> {
    const parsed = timerCreateSchema.parse(obj);

    return db.transaction(async tx => {
      const ret = await tx
        .insert(timerTable)
        .values(parsed)
        .returning({ id: timerTable.id });

      if (!ret || !ret.length || !ret[0].id) {
        throw new Error('Failed to create');
      }
      const result = await TimerService.getById(id, tx);
      if (!result) {
        throw new Error('Failed to retrieve object');
      }
      return result;
    });
  }

  static async update(id: Timer['id'], obj: Timer): Promise<Timer | undefined> {
    const parsed = timerUpdateSchema.parse(obj);

    return db.transaction(async tx => {
      const updated = await tx
        .update(timerTable)
        .set(parsed)
        .where(eq(timerTable.id, id))
        .returning();

      if (!updated || !updated.length) {
        throw new Error('Failed to update');
      }

      const result = await TimerService.getById(id, tx);

      if (!result) {
        throw new Error('Failed to retrieve object');
      }

      return result;
    });
  }
}
