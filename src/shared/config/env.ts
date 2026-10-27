import { existsSync } from "node:fs";
import { z } from "zod";

// Единственное место, где читаются и проверяются переменные окружения.
// Не реэкспортируется из index.ts: модуль только для серверного кода и скриптов.

const postgresUrl = z.url({ protocol: /^postgres(ql)?$/ });

const appEnvSchema = z.object({
  DATABASE_URL: postgresUrl,
});

const migrationEnvSchema = z.object({
  DATABASE_URL_UNPOOLED: postgresUrl,
});

type EnvSource = Record<string, string | undefined>;

function parseEnv<TSchema extends z.ZodType>(schema: TSchema, source: EnvSource): z.output<TSchema> {
  const result = schema.safeParse(source);
  if (!result.success) {
    // В сообщение попадают только имена переменных — значения содержат пароли.
    const names = [...new Set(result.error.issues.map((issue) => issue.path.join(".")))].join(", ");
    throw new Error(`Не заданы или некорректны переменные окружения: ${names}. Проверь .env (шаблон — .env.example).`);
  }
  return result.data;
}

/** Переменные для приложения: pooled-подключение к базе. */
export function getAppEnv(source: EnvSource = process.env) {
  return parseEnv(appEnvSchema, source);
}

/** Переменные для миграций и сида: прямое подключение к базе. */
export function getMigrationEnv(source: EnvSource = process.env) {
  return parseEnv(migrationEnvSchema, source);
}

/**
 * Подгружает локальный .env для скриптов вне Next (drizzle-kit, сид).
 * Уже заданные переменные не перезаписываются, поэтому production-строку можно передать явно.
 */
export function loadLocalEnvFile(path = ".env") {
  if (existsSync(path)) {
    process.loadEnvFile(path);
  }
}
