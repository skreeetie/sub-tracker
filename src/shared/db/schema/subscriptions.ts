import { sql } from "drizzle-orm";
import { check, date, index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { billingPeriods, subscriptionCategories } from "../../config/subscription-enums";
import { currencyEnum } from "./currency";
import { users } from "./users";

export const billingPeriodEnum = pgEnum("billing_period", billingPeriods);
export const subscriptionCategoryEnum = pgEnum("subscription_category", subscriptionCategories);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text().notNull(),
    /** Цена в минимальных единицах валюты подписки (копейки, центы). */
    priceMinor: integer().notNull(),
    currency: currencyEnum().notNull().default("RUB"),
    billingPeriod: billingPeriodEnum().notNull(),
    category: subscriptionCategoryEnum().notNull(),
    /** Календарная дата без времени: "YYYY-MM-DD". */
    startDate: date({ mode: "string" }).notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("subscriptions_user_id_idx").on(table.userId),
    check("subscriptions_price_minor_positive", sql`${table.priceMinor} > 0`),
    check("subscriptions_name_length", sql`char_length(${table.name}) between 1 and 100`),
  ],
);

export type SubscriptionRow = typeof subscriptions.$inferSelect;
export type NewSubscriptionRow = typeof subscriptions.$inferInsert;
