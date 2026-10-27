import { defineConfig } from "drizzle-kit";
import { getMigrationEnv, loadLocalEnvFile } from "./src/shared/config/env";

loadLocalEnvFile();

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
