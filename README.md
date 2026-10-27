# Sub Tracker

Трекер подписок: учёт сервисов в разных валютах, траты по месяцам и категориям, блок «Скоро продление».

Production: https://sub-tracker-iota.vercel.app

Стек: Next.js 16, React 19, TypeScript, Tailwind CSS v4, PostgreSQL (Neon) + Drizzle, Neon Auth, Recharts, Vitest. Архитектура — Feature-Sliced Design.

## Возможности

- Регистрация и вход по email и паролю или через Google, подтверждение email кодом.
- Подписки в RUB, USD, EUR, GBP, CNY, KZT, TRY: добавление, редактирование, удаление.
- Дашборд: траты в месяц и в год, график за 12 месяцев, распределение по категориям, ближайшие списания.
- Итоги пересчитываются в основную валюту пользователя по курсу ЦБ РФ.

## Развёртывание с нуля

Нужны Node.js 24+ и pnpm (версия — в `packageManager` в `package.json`).

1. **База.** Создайте проект в [Neon](https://neon.tech) и ветку `dev` для локальной разработки.
2. **Авторизация.** В Neon для каждой ветки: Settings → Auth → Enable Auth, включите вход по email с подтверждением при регистрации (Verify at Sign-up, метод — код). Вход через Google работает на общих ключах Neon; для production добавьте домен сайта в trusted domains.
3. **Переменные окружения.** Скопируйте `.env.example` в `.env` и заполните значениями ветки `dev`:
   - `DATABASE_URL` — строка подключения с пулом (хост с `-pooler`);
   - `DATABASE_URL_UNPOOLED` — строка без пула;
   - `NEON_AUTH_BASE_URL` — Auth URL ветки (Settings → Auth);
   - `NEON_AUTH_COOKIE_SECRET` — случайная строка не короче 32 символов: `openssl rand -base64 32`.
4. **Установка и миграции:**

   ```bash
   pnpm install
   pnpm db:migrate
   ```

5. **Запуск:** `pnpm dev` — приложение откроется на http://localhost:3000.

## Деплой (Vercel)

1. Импортируйте репозиторий в Vercel, регион функций — `fra1`, переменная `ENABLE_EXPERIMENTAL_COREPACK=1`.
2. Задайте в Vercel те же четыре переменные — со значениями основной ветки Neon.
3. Перед пушем изменений со схемой БД примените миграции к production: `pnpm db:migrate:prod` (спросит строку подключения основной ветки скрытым вводом). Пуш в `main` = production-деплой.

## Команды

| Команда | Что делает |
|---|---|
| `pnpm dev` | Dev-сервер |
| `pnpm build` | Production-сборка (с проверкой типов) |
| `pnpm lint` / `pnpm lint:fsd` | ESLint / правила FSD (steiger) |
| `pnpm test` | Unit-тесты (Vitest) |
| `pnpm db:generate` | Миграция по изменениям схемы |
| `pnpm db:migrate` / `pnpm db:migrate:prod` | Применить миграции к ветке из `.env` / к production |
| `pnpm db:studio` | Drizzle Studio |

## Документация

- [docs/SPEC.md](docs/SPEC.md) — фичи и критерии MVP
- [docs/PLAN.md](docs/PLAN.md) — план разработки по этапам
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — структура FSD, модели данных, ключевые решения
- [docs/AGENTS.md](docs/AGENTS.md) — правила и команды для AI-агента
