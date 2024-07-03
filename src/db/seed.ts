// THIS is a work in progress. I will come back to this. Manually setting role for now

const schema = require('./schema.ts');
const { roles } = require('./schema.ts');
const postgres = require('postgres');
const { env } = require('../env.ts');
const { drizzle } = require('drizzle-orm/postgres-js');

const main = async () => {
  const pg = postgres(env.DATABASE_URL);
  const db = drizzle(pg, { schema });
  const data = [];

  data.push({
    name: `Admin`,
  });

  data.push({
    name: `User`,
  });

  console.log('Seed start');
  await db.insert(roles).values(data);
  console.log('Seed done');
};

main();
