// Применяет миграции из drizzle/ к production-ветке Neon. Запуск: pnpm db:migrate:prod
// Строку подключения (DATABASE_URL_UNPOOLED основной ветки) спрашивает со скрытым вводом —
// она не попадает ни в историю shell, ни на экран. Можно передать заранее: PROD_DATABASE_URL_UNPOOLED=... pnpm db:migrate:prod
// Не drizzle-kit migrate: тот при ошибке не показывает её причину.
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const migrationsFolder = "./drizzle";

// Вывод, который можно «заглушить» на время ввода секрета.
let isMuted = false;
const output = new Writable({
  write(chunk, encoding, callback) {
    if (!isMuted) {
      process.stdout.write(chunk, encoding);
    }
    callback();
  },
});
const rl = createInterface({ input: process.stdin, output, terminal: process.stdin.isTTY });

async function askSecret(prompt) {
  process.stdout.write(prompt);
  isMuted = true;
  const answer = await rl.question("");
  isMuted = false;
  process.stdout.write("\n");
  return answer.trim();
}

function fail(message) {
  console.error(`✗ ${message}`);
  rl.close();
  process.exit(1);
}

async function countApplied(client) {
  try {
    const [row] = await client`select count(*)::int as n from drizzle.__drizzle_migrations`;
    return row.n;
  } catch {
    return 0; // таблицы журнала ещё нет — миграции не применялись
  }
}

const url =
  process.env.PROD_DATABASE_URL_UNPOOLED?.trim() ||
  (await askSecret("DATABASE_URL_UNPOOLED основной ветки Neon (ввод скрыт): "));

let host;
try {
  const parsed = new URL(url);
  if (!/^postgres(ql)?:$/.test(parsed.protocol)) {
    throw new Error("protocol");
  }
  host = parsed.hostname;
} catch {
  fail("Это не строка подключения Postgres: нужна только postgresql://..., без psql и кавычек.");
}
if (host.includes("-pooler")) {
  fail("Это pooled-строка (хост с -pooler). Для миграций нужно прямое подключение — Connection pooling выключен.");
}

const journal = JSON.parse(readFileSync(`${migrationsFolder}/meta/_journal.json`, "utf8"));
const client = postgres(url, { max: 1, onnotice: () => {} });

try {
  const appliedBefore = await countApplied(client);
  const pending = journal.entries.length - appliedBefore;
  console.log(`Хост: ${host}`);
  console.log(`Миграций в репозитории: ${journal.entries.length}, применено: ${appliedBefore}, новых: ${Math.max(pending, 0)}`);
  if (pending <= 0) {
    console.log("✓ Всё уже применено.");
  } else {
    const confirmation = await rl.question("Применить новые миграции к этой базе? Введите yes: ");
    if (confirmation.trim() !== "yes") {
      fail("Отменено.");
    }
    await migrate(drizzle({ client }), { migrationsFolder });
    console.log(`✓ Готово, применено миграций всего: ${await countApplied(client)}`);
  }
} catch (error) {
  const cause = error?.cause ?? error;
  console.error(`✗ Ошибка: ${cause?.code ?? ""} ${cause?.message ?? String(error)}`);
  process.exitCode = 1;
} finally {
  await client.end();
  rl.close();
}
