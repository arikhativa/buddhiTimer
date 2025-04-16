import {eq} from 'drizzle-orm';
import {
  ID,
  Settings,
  SettingsUpdate,
  settingsSchema,
  settingsTable,
  settingsUpdateSchema,
} from '~/db/schema/settings';
import {db} from '~/hooks/useDatabase';

const getQuery = db.query.settingsTable
  .findFirst({
    columns: {
      id: false,
    },
  })
  .prepare();

export class SettingsService {
  static async get(): Promise<Settings> {
    const raw = await getQuery.execute();

    return settingsSchema.parse(raw);
  }

  static async update(obj: SettingsUpdate): Promise<Settings> {
    const parsed = settingsUpdateSchema.parse(obj);

    const ret = await db
      .update(settingsTable)
      .set(parsed)
      .where(eq(settingsTable.id, ID))
      .returning();

    if (!ret || !ret.length) {
      throw new Error('Failed to update');
    }

    return ret[0];
  }
}
