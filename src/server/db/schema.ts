import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  json,
  pgEnum,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

import { env } from "~/env.mjs";
import { type UserRole } from "~/lib/auth/role";

export { UserRole } from "~/lib/auth/role";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const pgTable = pgTableCreator(
  (name) => `${env.DATABASE_TABLE_NAME_PREFIX}${name}`,
);

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: varchar("role", { length: 50 }).$type<UserRole>(),
});
export type User = typeof users.$inferSelect;

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  taskSolves: many(taskSolves),
}));

/* eslint-disable camelcase */
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    refresh_token_expires_in: integer("refresh_token_expires_in"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);
/* eslint-enable camelcase */
export type Account = typeof accounts.$inferSelect;

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});
export type Session = typeof sessions.$inferSelect;

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);
export type VerificationToken = typeof verificationTokens.$inferSelect;

export const taskDifficultyEnum = pgEnum("TaskDifficulty", [
  "easy",
  "medium",
  "hard",
]);

export const tasks = pgTable(
  "task",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    flagBase: text("flagBase").notNull(),
    flagUserSpecific: boolean("flagUserSpecific").notNull().default(true),
    title: text("title").notNull(),
    description: text("description").notNull(),
    text: text("text").notNull(),
    handler: text("handler"),
    difficulty: taskDifficultyEnum("difficulty").notNull(),
    position: integer("position").notNull().unique(),
    hidden: boolean("hidden").notNull().default(false),
  },
  (t) => ({
    positionIdx: index("position_idx").on(t.position).desc(),
  }),
);
export type Task = typeof tasks.$inferSelect;

export const tasksRelations = relations(tasks, ({ many }) => ({
  solves: many(taskSolves),
}));

export const taskSolves = pgTable(
  "taskSolves",
  {
    taskId: integer("taskId")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    startedAt: timestamp("startedAt", { mode: "date" }).notNull().defaultNow(),
    finishedAt: timestamp("finishedAt", { mode: "date" }),
    flag: text("flag").notNull(),
    metadata: json("metadata").notNull().default("{}"),
  },
  (ts) => ({
    compoundKey: primaryKey(ts.taskId, ts.userId),
  }),
);
export type TaskSolve = typeof taskSolves.$inferSelect;

export const taskSolvesRelations = relations(taskSolves, ({ one }) => ({
  task: one(tasks, { fields: [taskSolves.taskId], references: [tasks.id] }),
  user: one(users, { fields: [taskSolves.userId], references: [users.id] }),
}));
