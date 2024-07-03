import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { env } from '@/env';

declare global {
  var pgMigration: ReturnType<typeof postgres> | undefined;
}

// Ensure the global variable is properly typed
declare global {
  namespace NodeJS {
    interface Global {
      pgMigration: ReturnType<typeof postgres> | undefined;
    }
  }
}

// Use a self-executing async function to handle the migration logic
(async () => {
  if (env.NODE_ENV === 'production') {
    pgMigration = postgres(env.DATABASE_URL, { max: 1 });
    await migrate(drizzle(pgMigration), { migrationsFolder: '../../drizzle' });
  } else {
    if (!global.pgMigration) {
      global.pgMigration = postgres(env.DATABASE_URL, { max: 1 });
    }
    await migrate(drizzle(global.pgMigration), {
      migrationsFolder: '../../drizzle',
    });
  }
})().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1); // Exit with failure code
});
