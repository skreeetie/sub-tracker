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

const authEnvSchema = z.object({
  NEON_AUTH_BASE_URL: z.url({ protocol: /^https?$/ }),
  // Секрет подписи cookie сессии; Neon Auth требует не меньше 32 символов.
  NEON_AUTH_COOKIE_SECRET: z.string().min(32),
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

/** Переменные Neon Auth: адрес сервиса авторизации ветки и секрет cookie. */
export function getAuthEnv(source: EnvSource = process.env) {
  return parseEnv(authEnvSchema, source);
}

/** Переменные для миграций: прямое подключение к базе. */
export function getMigrationEnv(source: EnvSource = process.env) {
  return parseEnv(migrationEnvSchema, source);
}
