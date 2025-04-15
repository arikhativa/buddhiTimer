import {settingsSchema} from '~/db/schema/settings';
import {db} from '~/hooks/useDatabase';

const get = db.query.settingsTable
  .findFirst({
    columns: {
      id: false,
    },
  })
  .prepare();

export class SettingsService {
  static async get() {
    const raw = await get.execute();

    return settingsSchema.parse(raw);
  }
}
