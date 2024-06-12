import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '@/env';

// global is used to persist the database connection in development
declare global {
  var database: PostgresJsDatabase<typeof schema> | undefined;
  var pg: ReturnType<typeof postgres> | undefined;
}

let database: PostgresJsDatabase<typeof schema>;
let pg: ReturnType<typeof postgres>;

if (env.NODE_ENV === 'production') {
  pg = postgres(env.DATABASE_URL);
  database = drizzle(pg, { schema });
} else {
  if (!global.database) {
    pg = postgres(env.DATABASE_URL);
    global.database = drizzle(pg, { schema });
    global.pg = pg;
  }
  database = global.database;
  global.pg = pg!;
}

export { database, pg };
