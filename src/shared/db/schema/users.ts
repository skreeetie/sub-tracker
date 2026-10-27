import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { currencyEnum } from "./currency";

// Имена колонок в БД — snake_case (casing: "snake_case" в drizzle.config.ts и клиенте).
export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: text().notNull().unique(),
  name: text().notNull(),
  /** Основная валюта: в неё пересчитываются итоги дашборда. */
  displayCurrency: currencyEnum().notNull().default("RUB"),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
