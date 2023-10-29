import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  type DefaultSession,
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { type Simplify } from "type-fest";

import { env } from "~/env.mjs";
import { db } from "~/server/db";
import * as dbSchemaRaw from "~/server/db/schema";
import { type UserRole } from "~/server/db/schema";

import { baseLog } from "../lib/server/log";

const { pgTable, UserRole: _UserRole, ...dbSchema } = dbSchemaRaw;

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Session extends DefaultSession {
    user: Simplify<
      {
        id: string;
        email: string;
        role?: UserRole;
        // ...other properties
      } & DefaultSession["user"]
    >;
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface User {
    role?: UserRole;
  }
}

const authLogger = baseLog.child({ module: "auth" });

/**
 * Horrible hack to fix wrong (?) behaviour in the DrizzleAdapter implementation.
 *
 * @see https://github.com/nextauthjs/next-auth/discussions/7005#discussioncomment-7057322
 */
type PgTableParams = Parameters<typeof pgTable>;
const pgTableHijack = ((
  name: PgTableParams[0],
  columns: PgTableParams[1],
  extraConfig: PgTableParams[2],
) => {
  type DbSchemaKey = keyof typeof dbSchema;
  const pluralName = `${name}s`;

  if (name in dbSchema) {
    const existingName = name as DbSchemaKey;
    return dbSchema[existingName];
  }

  if (pluralName in dbSchema) {
    const existingName = pluralName as DbSchemaKey;
    return dbSchema[existingName];
  }

  return pgTable(name, columns, extraConfig);
}) as typeof pgTable;

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        email: user.email,
        role: user.role,
      },
    }),
  },
  adapter: DrizzleAdapter(db, pgTableHijack),
  debug: env.NODE_ENV === "development",
  logger: {
    error(code, errOrMeta) {
      authLogger.error({ code, errOrMeta });
    },
    warn(code) {
      authLogger.warn({ code });
    },
    debug(code, meta) {
      authLogger.debug({ code, meta });
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
    DiscordProvider({
      clientId: env.AUTH_DISCORD_ID,
      clientSecret: env.AUTH_DISCORD_SECRET,
    }),
    GitHubProvider({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
