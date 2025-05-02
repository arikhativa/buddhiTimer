import { eq } from 'drizzle-orm';
import {
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
    delete parsed.intervalBells;
    console.log('parsed', parsed);
    const ret = await db.insert(timerTable).values(parsed);
    console.log('ret', ret);

    // return db.transaction(async tx => {
    //   console.log('AA');
    //   const test = await tx.run('SELECT 1+1 as result');
    //   console.log('DB connection status:', test);
    //   const ret = await tx.insert(timerTable).values(parsed).timeout(34);
    //   console.log('QQ', ret);
    //   // .returning({ id: timerTable.id });

    //   // console.log('A2', ret);
    //   // if (!ret || !ret.length || !ret[0].id) {
    //   //   throw new Error('Failed to create');
    //   // }
    //   //
    //   // console.log('B');
    //   // await IntervalBellService.create(parsed.intervalBells, tx);
    //   //
    //   // const result = await TimerService.getById(ret[0].id, tx);
    //   // if (!result) {
    //   //   throw new Error('Failed to retrieve object');
    //   // }
    //   // console.log('C');
    //   // return result;
    // });
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
        throw new Error('Failed to update');
      }

      await IntervalBellService.upsert(parsed.intervalBells, tx);

      const result = await TimerService.getById(obj.id, tx);

      if (!result) {
        throw new Error('Failed to retrieve object');
      }

      return result;
    });
  }
}
