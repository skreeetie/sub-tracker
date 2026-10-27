import { z } from "zod";
import { currencies } from "@/shared/config";
import { parseIsoDate, type IsoDate } from "@/shared/lib";
import type { ExchangeRates } from "../model/exchange-rates";

// Формат https://www.cbr-xml-daily.ru/daily_json.js: Value — рублей за Nominal единиц валюты.
const cbrResponseSchema = z.object({
  Date: z.string(),
  Valute: z.record(
    z.string(),
    z.object({
      Nominal: z.number().positive(),
      Value: z.number().positive(),
    }),
  ),
});

export interface ParsedCbrRates {
  ratesDate: IsoDate;
  rates: ExchangeRates;
}

/** Курсы поддерживаемых валют из ответа сервиса. null — ответ не похож на курсы ЦБ. */
export function parseCbrResponse(data: unknown): ParsedCbrRates | null {
  const result = cbrResponseSchema.safeParse(data);
  if (!result.success) {
    return null;
  }

  const ratesDate = result.data.Date.slice(0, 10);
  if (!parseIsoDate(ratesDate)) {
    return null;
  }

  const rates: ExchangeRates = {};
  for (const currency of currencies) {
    const quote = result.data.Valute[currency];
    if (currency !== "RUB" && quote) {
      rates[currency] = quote.Value / quote.Nominal;
    }
  }
  return Object.keys(rates).length > 0 ? { ratesDate, rates } : null;
}
