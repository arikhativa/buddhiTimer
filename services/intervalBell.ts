import { eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import {
  IntervalBell,
  IntervalBellCreate,
  IntervalBellSchema,
  IntervalBellUpdate,
  intervalBellCreateSchema,
  intervalBellSchema,
  intervalBellTable,
  intervalBellUpdateSchema,
} from '~/db/schema';
import { db, Transaction } from '~/hooks/useDatabase';

export class IntervalBellService {
  static async getMany(
    timerId: IntervalBell['timerId'],
    tx?: Transaction,
  ): Promise<IntervalBell[]> {
    const src = tx || db;
    const raw = await src.query.intervalBellTable.findMany({
      where: intervalBell => eq(intervalBell.timerId, timerId),
    });

    return z.array(intervalBellSchema).parse(raw);
  }

  static async create(
    objs: IntervalBellCreate[],
    tx?: Transaction,
  ): Promise<void> {
    const parsed = z
      .array(intervalBellCreateSchema)
      .parse(objs.map(e => ({ ...e })));

    const src = tx || db;

    const ret = await src
      .insert(intervalBellTable)
      .values(parsed)
      .returning({ id: intervalBellTable.id });

    if (!ret || !ret.length) {
      throw new Error('Failed to create');
    }
  }

  static async update(
    objs: IntervalBellUpdate[],
    tx?: Transaction,
  ): Promise<void> {
    const parsed = z
      .array(intervalBellUpdateSchema)
      .parse(objs.map(e => ({ ...e })));

    const src = tx || db;

    for (const e of parsed) {
      const ret = await src
        .update(intervalBellTable)
        .set(e)
        .where(eq(intervalBellTable.id, e.id))
        .returning();

      if (!ret || !ret.length) {
        throw new Error('Failed to create');
      }
    }
  }

  static async delete(
    ids: IntervalBell['id'][],
    tx?: Transaction,
  ): Promise<void> {
    const src = tx || db;

    await src
      .delete(intervalBellTable)
      .where(inArray(intervalBellTable.id, ids))
      .returning();
  }

  static async upsert(
    objs: IntervalBellSchema[],
    timerId: number,
    tx?: Transaction,
  ): Promise<void> {
    if (!objs || !objs.length) return;
    const createList: IntervalBellCreate[] = [];
    const updateList: IntervalBellUpdate[] = [];

    objs.forEach(e => {
      if ((e as IntervalBell).id) {
        updateList.push(e as IntervalBellUpdate);
      } else {
        createList.push(e as IntervalBellCreate);
      }
    });

    const updateParsed = z.array(intervalBellUpdateSchema).parse(updateList);
    const createParsed = z.array(intervalBellCreateSchema).parse(createList);

    const src = tx || db;

    const list = await IntervalBellService.getMany(timerId);
    const allIds = list.map(e => e.id);
    const updatedIds = updateParsed.map(e => e.id);
    const idsToDelete = allIds.filter(e => !updatedIds.includes(e));

    if (idsToDelete) await IntervalBellService.delete(idsToDelete);
    if (updateParsed.length)
      await IntervalBellService.update(updateParsed, src as Transaction);
    if (createParsed.length)
      await IntervalBellService.create(createParsed, src as Transaction);
  }
}
