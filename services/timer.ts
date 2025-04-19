import { eq } from 'drizzle-orm';
import { Timer, timerSchema, timerTable } from '~/db/schema';
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

  static async create(id: Timer['id'], obj: Timer): Promise<Timer | undefined> {
    // const parsed = timerSchema.parse(obj);
    // return db.transaction(async tx => {
    //   const updated = await tx
    //     .update(timerTable)
    //     .set(parsed)
    //     .where(eq(timerTable.id, id))
    //     .returning();
    //   if (!updated || !updated.length) {
    //     throw new Error('Failed to update');
    //   }
    //   const result = await TimerService.getById(id, tx);
    //   if (!result) {
    //     throw new Error('Failed to retrieve updated object');
    //   }
    //   return result;
    // });
  }

  static async update(id: Timer['id'], obj: Timer): Promise<Timer | undefined> {
    const parsed = timerSchema.parse(obj);

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
        throw new Error('Failed to retrieve updated object');
      }

      return result;
    });
  }
}
