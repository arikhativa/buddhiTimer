import {settingsSchema, settingsTable} from '~/db/schema/settings';
import {db} from '~/hooks/useDatabase';

export class SettingsService {
  static async get() {
    const rows = await db.select().from(settingsTable).limit(1);
    const obj = settingsSchema.parse(rows[0]);

    return obj;
  }
}
