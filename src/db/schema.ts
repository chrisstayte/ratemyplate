import {
  boolean,
  timestamp,
  pgTable,
  serial,
  text,
  primaryKey,
  varchar,
  integer,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { AdapterAccountType } from 'next-auth/adapters';

export const plates = pgTable('rmp_plates', {
  id: serial('id').primaryKey(),
  plateNumber: text('plateNumber').notNull(),
  state: varchar('state', { length: 2 }).notNull(),
  timestamp: timestamp('timestamp', { mode: 'date' }).notNull().defaultNow(),
  userId: text('userId').references(() => users.id),
});

export const plates_relations = relations(plates, ({ one, many }) => ({
  comments: many(comments),
  user: one(users, {
    fields: [plates.userId],
    references: [users.id],
  }),
}));

export const comments = pgTable('rmp_comments', {
  id: serial('id').primaryKey(),
  userId: text('userId').references(() => users.id),
  plateId: integer('plateId').references(() => plates.id),
  comment: text('comment').notNull(),
  timestamp: timestamp('timestamp', { mode: 'date' }).notNull().defaultNow(),
});

export const comments_relations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  plate: one(plates, {
    fields: [comments.plateId],
    references: [plates.id],
  }),
}));

// Next AUTH -> Postgres

export const users = pgTable('rmp_user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const users_relations = relations(users, ({ many }) => ({
  comments: many(comments),
  plates: many(plates),
  userRoles: many(user_roles),
}));

export const accounts = pgTable(
  'rmp_account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable('rmp_session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'rmp_verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  'rmp_authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const roles = pgTable('rmp_roles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const roles_relations = relations(roles, ({ many }) => ({
  userRoles: many(user_roles),
}));

export const user_roles = pgTable(
  'rmp_user_roles',
  {
    userId: text('userId').references(() => users.id, { onDelete: 'cascade' }),
    roleId: integer('roleId').references(() => roles.id, {
      onDelete: 'cascade',
    }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.roleId] }) })
);

export const user_role_relations = relations(user_roles, ({ one }) => ({
  user: one(users, {
    fields: [user_roles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [user_roles.roleId],
    references: [roles.id],
  }),
}));
