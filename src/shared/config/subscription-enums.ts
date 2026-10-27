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
