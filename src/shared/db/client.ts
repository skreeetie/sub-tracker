import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import { getAppEnv } from "@/shared/config/env";
import * as schema from "./schema";

// В dev Next перезагружает модули — переиспользуем подключение, чтобы не плодить соединения.
const globalForDb = globalThis as typeof globalThis & { postgresClient?: Sql };

const client =
  globalForDb.postgresClient ??
  postgres(getAppEnv().DATABASE_URL, {
    // Пул Neon работает в режиме транзакций и не поддерживает подготовленные запросы.
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresClient = client;
}

export const db = drizzle({ client, schema, casing: "snake_case" });
