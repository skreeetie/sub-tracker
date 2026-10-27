import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";
import { getMigrationEnv } from "./src/shared/config/env";

// drizzle-kit работает вне Next, поэтому .env подгружаем сами. Уже заданные в shell переменные
// не перезаписываются — так production-строку можно передать явно.
// (Не в shared/config/env.ts: доступ к файловой системе там заставил бы Vercel трассировать весь проект.)
if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/shared/db/schema/index.ts",
  out: "./drizzle",
  casing: "snake_case",
  // Миграции — по прямому подключению, мимо пула Neon.
  dbCredentials: { url: getMigrationEnv().DATABASE_URL_UNPOOLED },
  strict: true,
  verbose: true,
});
