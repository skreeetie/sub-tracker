import { sql } from "drizzle-orm";
import { check, date, doublePrecision, pgTable, timestamp } from "drizzle-orm/pg-core";
import { currencyEnum } from "./currency";

/** Последний полученный курс ЦБ РФ: кэш и запасной вариант при недоступности сервиса курсов. */
export const exchangeRates = pgTable(
  "exchange_rates",
  {
    currency: currencyEnum().primaryKey(),
    /** Рублей за 1 единицу валюты — уже с учётом номинала ЦБ (тенге котируется за 100). */
    rubPerUnit: doublePrecision().notNull(),
    /** Дата курса ЦБ. */
    ratesDate: date({ mode: "string" }).notNull(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check("exchange_rates_rub_per_unit_positive", sql`${table.rubPerUnit} > 0`)],
);

export type ExchangeRateRow = typeof exchangeRates.$inferSelect;
