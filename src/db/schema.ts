import { pgTable, serial } from 'drizzle-orm/pg-core';

export const plates = pgTable('rmp_plates', {
  id: serial('id').primaryKey(),
});
