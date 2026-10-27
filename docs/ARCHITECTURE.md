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
│   │   └── delete-subscription/
│   ├── entities/
│   │   ├── session/                 # getCurrentUser(), работа с cookie
│   │   ├── user/
│   │   └── subscription/            # типы, категории, расчёт дат и стоимости, запросы
│   └── shared/
│       ├── ui/                      # Button, Input, Card, Modal, ...
│       ├── lib/                     # date, money, cn, ...
│       ├── config/                  # env (валидация переменных окружения), константы
│       └── db/                      # клиент БД (server-only) + Drizzle-схема
│           ├── client.ts
│           ├── schema/              # users.ts, subscriptions.ts, enums.ts, index.ts
│           └── seed.ts
├── .env.example
├── drizzle.config.ts
└── vitest.config.ts
```

## 3. Модели данных

### `users`

| Поле | Тип | Ограничения |
|---|---|---|
| `id` | `uuid` | PK, `default gen_random_uuid()` |
| `email` | `text` | `NOT NULL`, `UNIQUE` |
| `name` | `text` | `NOT NULL` |
| `created_at` | `timestamptz` | `NOT NULL`, `default now()` |

### `subscriptions`

| Поле | Тип | Ограничения |
|---|---|---|
| `id` | `uuid` | PK, `default gen_random_uuid()` |
| `user_id` | `uuid` | `NOT NULL`, FK → `users.id` `ON DELETE CASCADE`, **индекс** |
| `name` | `text` | `NOT NULL`, длина 1–100 |
| `price_minor` | `integer` | `NOT NULL`, `CHECK (price_minor > 0)` — цена в копейках |
| `billing_period` | enum `billing_period` | `'monthly' \| 'yearly'` |
| `category` | enum `subscription_category` | `'video' \| 'music' \| 'software' \| 'cloud' \| 'games' \| 'education' \| 'other'` |
| `start_date` | `date` | `NOT NULL` |
| `created_at` | `timestamptz` | `NOT NULL`, `default now()` |
| `updated_at` | `timestamptz` | `NOT NULL`, `default now()`, обновляется при изменении |

Имена таблиц и колонок — `snake_case` в нижнем регистре, в TypeScript — `camelCase` (маппинг через `casing: "snake_case"` в Drizzle).

### Вычисляемые значения (не хранятся в БД)

- **Следующая дата списания** — от `start_date` шагами по периоду до первой даты ≥ сегодня. Если дня нет в месяце (31 января → февраль) — берётся последний день месяца.
- **Месячная стоимость** — `monthly`: `price`, `yearly`: `price / 12`.
- **Траты по месяцам** — сумма фактических списаний, попавших в каждый месяц (годовая подписка — целиком в месяц списания).
- **Траты по категориям** — сумма месячных стоимостей, сгруппированная по `category`.

Всё это — чистые функции в `entities/subscription/lib` и `shared/lib/date`, покрытые unit-тестами.

## 4. Ключевые решения

1. **Деньги — целые числа в минимальных единицах** (`price_minor`, копейки). Никаких `float` для денег; форматирование — через `Intl.NumberFormat` в `shared/lib/money`.
   В MVP одна валюта — **рубль (₽)**, поэтому колонки валюты нет; валюта задаётся константой в `shared/config`.
2. **Даты подписок — тип `date` без времени.** Расчёты делаются в календарных датах (год-месяц-день), а не в timestamp — это убирает ошибки часовых поясов.
3. **Категории и периоды — Postgres enum + `as const` массив в коде** (единый источник для формы, валидации и графиков). Добавление категории = миграция.
4. **Чтение данных — в Server Components** напрямую через функции из `entities/*/api`. **Мутации — Server Actions** в `features/*/api` с серверной валидацией и `revalidatePath`. Отдельные REST-эндпоинты не нужны.
5. **Каждый запрос фильтруется по `user_id` текущего пользователя** — пользователь не может прочитать/изменить чужую подписку, даже зная `id`.
6. **Моковая авторизация изолирована в `entities/session`.** Вход: server action ставит httpOnly-cookie с id демо-пользователя. Весь остальной код получает пользователя только через `getCurrentUser()` / `requireUser()`. Замена на реальную авторизацию потом затронет только этот слайс и `features/auth`.
7. **Защита кабинета** — проверка в `src/app/(cabinet)/layout.tsx` (+ проверка пользователя в каждом server action). `proxy.ts` (бывший `middleware.ts` в Next 16) — опционально, только для быстрого редиректа.
8. **Переменные окружения** читаются и валидируются в одном месте — `shared/config/env.ts`.
9. **Тесты** — Vitest, файлы `*.test.ts` рядом с тестируемым кодом. Основной фокус — `lib`-сегменты и схемы валидации.
10. **ORM — Drizzle.** Схема описана на TypeScript в `shared/db/schema` (это инфраструктура, а не бизнес-логика, поэтому она в `shared`, а не в `entities` — иначе FK между `subscriptions` и `users` потребовал бы кросс-импорта сущностей). Миграции генерируются `drizzle-kit generate` в `drizzle/` и применяются `drizzle-kit migrate`; `drizzle-kit push` не используется. Сущности (`entities/*/api`) работают с БД через клиент из `shared/db` и отдают наружу доменные типы.

## 5. Зависимости

Согласованные зависимости и этап, на котором они появляются:

| Пакет | Зачем | Этап |
|---|---|---|
| `vitest` | unit-тесты | 1 |
| `steiger`, `@feature-sliced/steiger-plugin` | проверка правил FSD | 2 |
| `drizzle-orm`, `drizzle-kit`, драйвер Postgres | ORM и миграции | 3 |
| `zod` | валидация env и форм | 3 |
| `server-only` | защита серверного кода от попадания в клиент | 3 |
| `recharts` | графики на дашборде | 7 |

Любые другие зависимости — только после согласования.

## 6. Открытые вопросы

- **Локальный PostgreSQL без Docker** — способ установки выбираем на этапе 3 (Homebrew `postgresql@17`, Postgres.app или облачный Neon).
