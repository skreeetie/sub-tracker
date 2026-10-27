// Значения enum'ов БД — единый источник для схемы Drizzle, валидации и интерфейса.
// Файл без зависимостей: его импортирует и схема (относительным путём), и клиентский код.
// Изменение списка = новая миграция.

export const billingPeriods = ["monthly", "yearly"] as const;

export const subscriptionCategories = [
  "video",
  "music",
  "software",
  "cloud",
  "games",
  "education",
  "other",
] as const;

/** Валюты подписок и основной валюты пользователя (ISO 4217). У всех — две цифры после запятой. */
export const currencies = ["RUB", "USD", "EUR", "GBP", "CNY", "KZT", "TRY"] as const;
