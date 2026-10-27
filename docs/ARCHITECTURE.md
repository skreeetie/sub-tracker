# ARCHITECTURE.md — архитектура sub-tracker

## 1. Feature-Sliced Design поверх Next.js App Router

Слои (сверху вниз; импортировать можно **только из слоёв ниже**):

| Слой | Назначение | Пример |
|---|---|---|
| `app` | Роутинг Next.js, корневой лейаут, провайдеры, глобальные стили | `src/app/(cabinet)/dashboard/page.tsx` |
| `views` | Страницы целиком (FSD-слой `pages`) | `views/dashboard` |
| `widgets` | Крупные самостоятельные блоки UI | `widgets/app-header`, `widgets/spending-chart` |
| `features` | Действия пользователя, приносящие ценность | `features/create-subscription`, `features/auth` |
| `entities` | Бизнес-сущности: типы, данные, чистая логика, UI-представление | `entities/subscription`, `entities/user` |
| `shared` | Переиспользуемое без бизнес-логики | `shared/ui`, `shared/lib`, `shared/db` |

**Почему `views`, а не `pages`:** папка `src/pages` включает в Next.js Pages Router и конфликтует с App Router. Поэтому FSD-слой `pages` назван `views`.

**Почему `app` совмещён с роутингом:** файлы в `src/app` — тонкие обёртки: `page.tsx` только импортирует страницу из `views` (и при необходимости делает проверки/редиректы). Логики в роутах нет.

### Правила импортов

- Слой импортирует только из нижележащих слоёв (`features` → `entities`, `shared`; не наоборот).
- Слайсы одного слоя не импортируют друг друга (`features/a` ✗ → `features/b`). Исключение по FSD: `entities` могут ссылаться друг на друга через `@x`-нотацию — использовать только при реальной необходимости.
- Снаружи слайса импорт только через публичный API: `@/entities/subscription`, а не `@/entities/subscription/model/types`.
- Серверный код (запросы к БД, server actions) помечается `"use server"` / импортом `server-only` и не попадает в клиентские компоненты.

### Сегменты внутри слайса

```
<slice>/
  ui/       — React-компоненты
  model/    — типы, константы, схемы валидации, состояние
  lib/      — чистые функции (расчёты, форматирование) — основное место для unit-тестов
  api/      — серверные запросы (entities) / server actions (features)
  index.ts  — публичный API слайса
```

## 2. Структура папок

```
sub-tracker/
├── docs/                       # AGENTS, SPEC, PLAN, ARCHITECTURE
├── drizzle/                    # SQL-миграции, сгенерированные drizzle-kit (коммитятся)
├── public/
├── src/
│   ├── app/                    # слой app + роутинг Next.js
│   │   ├── layout.tsx          # корневой лейаут, шрифты, globals.css
│   │   ├── globals.css         # Tailwind + дизайн-токены (@theme)
│   │   ├── (public)/
│   │   │   └── page.tsx        # стартовая страница с кнопкой «Войти»
│   │   └── (cabinet)/
│   │       ├── layout.tsx      # проверка сессии → редирект гостя; шапка + навигация
│   │       ├── dashboard/page.tsx
│   │       ├── subscriptions/page.tsx
│   │       ├── subscriptions/new/page.tsx
│   │       ├── subscriptions/[id]/edit/page.tsx
│   │       └── profile/page.tsx
│   ├── views/
│   │   ├── landing/
│   │   ├── dashboard/
│   │   ├── subscriptions/
│   │   ├── subscription-create/
│   │   ├── subscription-edit/
│   │   └── profile/
│   ├── widgets/
│   │   ├── app-header/
│   │   ├── app-sidebar/
│   │   ├── subscription-list/
│   │   ├── spending-summary/
│   │   ├── spending-by-month/
│   │   ├── spending-by-category/
│   │   └── upcoming-renewals/
│   ├── features/
│   │   ├── auth/                    # login (демо) / logout
│   │   ├── create-subscription/
│   │   ├── edit-subscription/
│   │   ├── delete-subscription/
│   │   └── change-display-currency/ # выбор основной валюты в профиле
│   ├── entities/
│   │   ├── session/                 # getCurrentUser(), работа с cookie
│   │   ├── user/
│   │   ├── subscription/            # типы, категории, расчёт дат и стоимости, запросы
│   │   └── exchange-rate/           # курсы ЦБ, пересчёт сумм между валютами
│   └── shared/
│       ├── ui/                      # Button, Input, Card, Modal, ...
│       ├── lib/                     # date, money, cn, ...
│       ├── config/                  # routes, demo-user, session-cookie; env.ts — только сервер/скрипты, не реэкспортируется из index
│       └── db/                      # клиент БД (server-only) + Drizzle-схема
│           ├── client.ts            # pooled-подключение для приложения
│           ├── schema/              # users.ts, subscriptions.ts, index.ts
│           └── seed.ts              # сид демо-данных (запуск через tsx)
├── .env.example
├── drizzle.config.ts
└── vitest.config.mts
```

## 3. Модели данных

### `users`

| Поле | Тип | Ограничения |
|---|---|---|
| `id` | `uuid` | PK, `default gen_random_uuid()` |
| `email` | `text` | `NOT NULL`, `UNIQUE` |
| `name` | `text` | `NOT NULL` |
| `display_currency` | enum `currency` | `NOT NULL`, `default 'RUB'` — основная валюта: в неё пересчитываются итоги |
| `created_at` | `timestamptz` | `NOT NULL`, `default now()` |

### `subscriptions`

| Поле | Тип | Ограничения |
|---|---|---|
| `id` | `uuid` | PK, `default gen_random_uuid()` |
| `user_id` | `uuid` | `NOT NULL`, FK → `users.id` `ON DELETE CASCADE`, **индекс** |
| `name` | `text` | `NOT NULL`, длина 1–100 |
| `price_minor` | `integer` | `NOT NULL`, `CHECK (price_minor > 0)` — цена в минимальных единицах валюты подписки (копейки, центы) |
| `currency` | enum `currency` | `NOT NULL`, `default 'RUB'` — `'RUB' \| 'USD' \| 'EUR' \| 'GBP' \| 'CNY' \| 'KZT' \| 'TRY'` |
| `billing_period` | enum `billing_period` | `'monthly' \| 'yearly'` |
| `category` | enum `subscription_category` | `'video' \| 'music' \| 'software' \| 'cloud' \| 'games' \| 'education' \| 'other'` |
| `start_date` | `date` | `NOT NULL` |
| `created_at` | `timestamptz` | `NOT NULL`, `default now()` |
| `updated_at` | `timestamptz` | `NOT NULL`, `default now()`, обновляется при изменении |

### `exchange_rates`

Последний полученный курс ЦБ РФ — кэш и запасной вариант, если сервис курсов недоступен.

| Поле | Тип | Ограничения |
|---|---|---|
| `currency` | enum `currency` | PK |
| `rub_per_unit` | `double precision` | `NOT NULL`, `CHECK (rub_per_unit > 0)` — рублей за 1 единицу валюты (с учётом номинала ЦБ) |
| `rates_date` | `date` | `NOT NULL` — дата курса ЦБ |
| `updated_at` | `timestamptz` | `NOT NULL`, `default now()` — когда курс получен |

Имена таблиц и колонок — `snake_case` в нижнем регистре, в TypeScript — `camelCase` (маппинг через `casing: "snake_case"` в Drizzle).

### Вычисляемые значения (не хранятся в БД)

- **Следующая дата списания** — от `start_date` шагами по периоду до первой даты ≥ сегодня. Если дня нет в месяце (31 января → февраль) — берётся последний день месяца.
- **Месячная стоимость** — `monthly`: `price`, `yearly`: `price / 12`.
- **Пересчёт в основную валюту** — `сумма × курс_из / курс_в` (курсы — рублей за единицу), округление до минимальной единицы. Каждая подписка пересчитывается в основную валюту до агрегаций; траты прошлых месяцев — по текущему курсу.
- **Траты по месяцам** — сумма фактических списаний, попавших в каждый месяц, за последние 12 месяцев включая текущий (годовая подписка — целиком в месяц списания). Учитываются только списания по сегодняшний день включительно — будущие даты текущего месяца не входят.
- **Траты по категориям** — сумма месячных стоимостей, сгруппированная по `category`.
- **Активные подписки** — все подписки пользователя, включая начинающиеся в будущем: статуса и даты окончания в модели нет.
- **Скоро продление** — подписки, у которых следующее списание с сегодня по 7-й день включительно.
- Месячные суммы считаются от годовой суммы и округляются до копейки один раз (`round(годовая / 12)`), а не по каждой подписке.

Всё это — чистые функции в `entities/subscription/lib` и `shared/lib/date`, покрытые unit-тестами.

## 4. Ключевые решения

1. **Деньги — целые числа в минимальных единицах** (`price_minor`: копейки, центы). Никаких `float` для денег; форматирование — через `Intl.NumberFormat` в `shared/lib/money`, валюта передаётся явно.
   У всех поддерживаемых валют две цифры после запятой. Валюта подписки — колонка `currency`; список валют — `as const` массив в `shared/config/subscription-enums.ts` (как категории), подписи — в `shared/config/currencies.ts`.
2. **Даты подписок — тип `date` без времени.** Расчёты делаются в календарных датах (год-месяц-день), а не в timestamp — это убирает ошибки часовых поясов.
3. **Категории и периоды — Postgres enum + `as const` массив в коде** (единый источник для формы, валидации и графиков). Массивы лежат в `shared/config/subscription-enums.ts` (файл без зависимостей): их импортирует схема Drizzle (относительным путём) и клиентский код (через `@/shared/config`). Добавление категории = миграция.
4. **Чтение данных — в Server Components** напрямую через функции из `entities/*/api`. **Мутации — Server Actions** в `features/*/api` с серверной валидацией и `revalidatePath`. Отдельные REST-эндпоинты не нужны.
5. **Каждый запрос фильтруется по `user_id` текущего пользователя** — пользователь не может прочитать/изменить чужую подписку, даже зная `id`.
6. **Моковая авторизация изолирована в `entities/session`.** Вход: server action ставит httpOnly-cookie с id демо-пользователя. Весь остальной код получает пользователя только через `getCurrentUser()` / `requireUser()`. Замена на реальную авторизацию потом затронет только этот слайс и `features/auth`.
7. **Защита кабинета** — проверка в `src/app/(cabinet)/layout.tsx` (+ проверка пользователя в каждом server action). `proxy.ts` (бывший `middleware.ts` в Next 16) — опционально, только для быстрого редиректа.
8. **Переменные окружения** читаются и валидируются в одном месте — `shared/config/env.ts`.
9. **Тесты** — Vitest, файлы `*.test.ts` рядом с тестируемым кодом. Основной фокус — `lib`-сегменты и схемы валидации.
10. **ORM — Drizzle.** Схема описана на TypeScript в `shared/db/schema` (это инфраструктура, а не бизнес-логика, поэтому она в `shared`, а не в `entities` — иначе FK между `subscriptions` и `users` потребовал бы кросс-импорта сущностей). Миграции генерируются `drizzle-kit generate` в `drizzle/` и применяются `drizzle-kit migrate`; `drizzle-kit push` не используется. Сущности (`entities/*/api`) работают с БД через клиент из `shared/db` и отдают наружу доменные типы.
   Файлы схемы импортируют друг друга относительными путями (drizzle-kit не понимает алиас `@/`).
11. **База — PostgreSQL в Neon**, подключённая через Vercel Marketplace (Vercel сам прописывает переменные во все окружения проекта). Две строки подключения:
    - `DATABASE_URL` — pooled (хост с `-pooler`), для приложения; драйвер `postgres` с `prepare: false`, т.к. пул работает в режиме транзакций;
    - `DATABASE_URL_UNPOOLED` — direct, для `drizzle-kit` (миграции) и сида.
    Драйвер — обычный `postgres` (postgres.js), не привязан к Neon; переход на `@neondatabase/serverless` (edge) затронет только `shared/db/client.ts`.
    `.env` в приложении читает Next, в `drizzle.config.ts` и сиде — `process.loadEnvFile()` (без `dotenv`).
    Ветки Neon: production-деплой работает с основной веткой, локальная разработка — с веткой `dev` (локальный `.env` указывает на неё).
12. **Хостинг — Vercel**, регион функций `fra1` (рядом с базой Neon во Франкфурте). Пуш в `main` = production-деплой, остальные ветки и PR — preview-деплои. Сборка на pnpm из `packageManager` (`ENABLE_EXPERIMENTAL_COREPACK=1`).
13. **Миграции на production применяются вручную** (`pnpm db:migrate` с production-строкой подключения), а не в сборке Vercel: ошибка миграции не ломает деплой и не меняет базу без ведома пользователя.
14. **Публичный API слайса с серверным кодом делится на два файла.** `index.ts` — безопасный для клиента (типы, константы, валидация, чистые функции, UI), `index.server.ts` — запросы к БД (`server-only`). Серверный код импортирует `@/entities/<slice>/index.server`. Иначе клиентский компонент, которому нужна схема валидации, втянул бы в бандл драйвер БД. Steiger считает `index.server.ts` полноценным публичным API.
15. **«Сегодня» считается в часовом поясе приложения** — `appTimeZone = "Europe/Moscow"` в `shared/config`. От него зависят даты следующего списания. В MVP один часовой пояс на всё приложение.
16. **Правило steiger `fsd/insignificant-slice` отключено.** Слой страниц называется `views` (не `pages`), steiger его не анализирует и не видит ссылок из него — правило помечало бы используемые слайсы как лишние.
17. **Форма подписки — общая, в `entities/subscription/ui`.** Слайсы `features` не импортируют друг друга, поэтому поля, клиентская валидация и состояние формы (`SubscriptionFormState`) лежат в сущности, а `features/create-subscription` и `features/edit-subscription` передают в неё свой server action. id редактируемой подписки привязывается через `bind`, приходит от клиента и проверяется в action (uuid + `user_id`).
18. **Графики.** Траты по месяцам — столбчатый график Recharts (клиентский компонент; данные и подписи считаются на сервере). Траты по категориям — HTML-полосы одного цвета с подписями и суммами: подпись не обрезается на мобильных и не нужна палитра на 7 категорий. Цвета графиков — дизайн-токены из `globals.css` (`var(--accent)`, `var(--line)`, `var(--muted)`), поэтому тёмная тема работает без отдельной настройки.
19. **Курсы валют — ЦБ РФ через cbr-xml-daily.ru** (`https://www.cbr-xml-daily.ru/daily_json.js`, без ключа; cbr.ru напрямую может не отвечать на зарубежные IP Vercel). Таблица `exchange_rates` — кэш: если курсы свежее 6 часов, они берутся из БД, иначе запрашиваются у сервиса (таймаут 3 с) и сохраняются. Сервис недоступен — используется последний сохранённый курс; курсов нет вовсе — подписки в других валютах не входят в итоги, дашборд предупреждает. Ответ сервиса проверяется Zod-схемой. Код — `entities/exchange-rate`.
20. **Основная валюта — у пользователя** (`users.display_currency`), меняется в профиле (`features/change-display-currency`). Дашборд пересчитывает подписки в неё до агрегаций, поэтому функции агрегации работают с одной валютой.

## 5. Зависимости

Согласованные зависимости и этап, на котором они появляются:

| Пакет | Зачем | Этап |
|---|---|---|
| `vitest` | unit-тесты | 1 |
| `steiger`, `@feature-sliced/steiger-plugin` | проверка правил FSD | 2 |
| `drizzle-orm`, `drizzle-kit` | ORM и миграции | 4 |
| `postgres` (postgres.js) | драйвер PostgreSQL | 4 |
| `zod` | валидация env и форм | 4 |
| `server-only` | защита серверного кода от попадания в клиент | 4 |
| `tsx` | запуск TS-скриптов (сид) | 4 |
| `recharts` | графики на дашборде | 8 |

Внешние сервисы: курсы ЦБ РФ — cbr-xml-daily.ru (HTTP-запрос без пакета, этап 10).

Любые другие зависимости — только после согласования.

## 6. Открытые вопросы

Нет.
