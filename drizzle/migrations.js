import journal from './meta/_journal.json';
import m0000 from './0000_eager_chronomancer.sql';
import m0001 from './0001_seed-settings.sql';

export default {
  journal,
  migrations: {
    m0000,
    m0001,
  },
};

