import { pgEnum } from "drizzle-orm/pg-core";
import { currencies } from "../../config/subscription-enums";

// Общий enum для users, subscriptions и exchange_rates.
export const currencyEnum = pgEnum("currency", currencies);
