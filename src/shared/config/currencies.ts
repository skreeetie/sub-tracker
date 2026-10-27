import { currencies } from "./subscription-enums";

export type Currency = (typeof currencies)[number];

export const currencyLabels: Record<Currency, string> = {
  RUB: "Российский рубль",
  USD: "Доллар США",
  EUR: "Евро",
  GBP: "Фунт стерлингов",
  CNY: "Китайский юань",
  KZT: "Казахстанский тенге",
  TRY: "Турецкая лира",
};

/** Валюта по умолчанию: для новых пользователей и существующих подписок. */
export const defaultCurrency: Currency = "RUB";

export function isCurrency(value: unknown): value is Currency {
  return typeof value === "string" && (currencies as readonly string[]).includes(value);
}
