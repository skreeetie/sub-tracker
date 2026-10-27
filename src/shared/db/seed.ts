// Сид демо-данных. Запуск: pnpm db:seed (через tsx, вне Next).
// Не импортирует ./client — тот помечен server-only и работает через пул.
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { demoUser } from "@/shared/config";
import { getMigrationEnv, loadLocalEnvFile } from "@/shared/config/env";
import { users } from "./schema";

async function seed() {
  loadLocalEnvFile();
  const client = postgres(getMigrationEnv().DATABASE_URL_UNPOOLED, { max: 1 });
  const db = drizzle({ client, casing: "snake_case" });

  try {
    const inserted = await db
      .insert(users)
      .values(demoUser)
      .onConflictDoNothing({ target: users.email })
      .returning({ id: users.id });

    console.log(
      inserted.length > 0
        ? `Демо-пользователь создан: ${demoUser.email}`
        : `Демо-пользователь уже существует: ${demoUser.email}`,
    );
  } finally {
    await client.end();
  }
}

seed().catch((error: unknown) => {
  console.error("Сид не выполнен:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
