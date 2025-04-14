import {defineConfig} from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'durable-sqlite',
  schema: './db/schema.ts',
  out: './drizzle',
});
