import {
  boolean,
  timestamp,
  pgTable,
  serial,
  text,
  primaryKey,
  uniqueIndex,
  varchar,
  integer,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const plates = pgTable('plates', {
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

export const comments = pgTable('comments', {
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

// Better Auth tables

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const users_relations = relations(users, ({ many }) => ({
  comments: many(comments),
  plates: many(plates),
  userRoles: many(user_roles),
}));

export const accounts = pgTable(
  'account',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    accessTokenExpiresAt: timestamp('accessTokenExpiresAt', {
      mode: 'date',
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt', {
      mode: 'date',
      withTimezone: true,
    }),
    scope: text('scope'),
    idToken: text('idToken'),
    password: text('password'),
    createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (account) => ({
    providerAccountIdIdx: uniqueIndex(
      'account_providerId_accountId_idx'
    ).on(account.providerId, account.accountId),
  })
);

export const sessions = pgTable('session', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expiresAt', { mode: 'date', withTimezone: true }).notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const verificationTokens = pgTable(
  'verification',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expiresAt', { mode: 'date', withTimezone: true }).notNull(),
    createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (verification) => ({
    identifierValueIdx: uniqueIndex(
      'verification_identifier_value_idx'
    ).on(verification.identifier, verification.value),
  })
);

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const roles_relations = relations(roles, ({ many }) => ({
  userRoles: many(user_roles),
}));

export const user_roles = pgTable(
  'user_roles',
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

export const user_favorite_plates = pgTable(
  'user_favorite_plates',
  {
    userId: text('userId').references(() => users.id, { onDelete: 'cascade' }),
    plateId: integer('plateId').references(() => plates.id, {
      onDelete: 'cascade',
    }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.plateId] }) })
);

export const user_favorite_plate_relations = relations(
  user_favorite_plates,
  ({ one }) => ({
    user: one(users, {
      fields: [user_favorite_plates.userId],
      references: [users.id],
    }),
    plate: one(plates, {
      fields: [user_favorite_plates.plateId],
      references: [plates.id],
    }),
  })
);
