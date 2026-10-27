import type { Currency } from "@/shared/config";
import type { IsoDate } from "@/shared/lib";

/** Рублей за 1 единицу валюты. Валюты без курса отсутствуют; у рубля курс всегда 1. */
export type ExchangeRates = Partial<Record<Currency, number>>;

export interface ExchangeRatesSnapshot {
  rates: ExchangeRates;
  /** Дата курса ЦБ; null, если курсов нет совсем. */
  ratesDate: IsoDate | null;
  /** true — сервис курсов недоступен и используется последний сохранённый курс. */
  isStale: boolean;
}
