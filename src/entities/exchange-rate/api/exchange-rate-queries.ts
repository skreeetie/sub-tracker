import "server-only";
import { sql } from "drizzle-orm";
import { cache } from "react";
import { currencies } from "@/shared/config";
import { db, exchangeRates, type ExchangeRateRow } from "@/shared/db";
import type { ExchangeRates, ExchangeRatesSnapshot } from "../model/exchange-rates";
import { parseCbrResponse, type ParsedCbrRates } from "../lib/parse-cbr-response";

const cbrDailyUrl = "https://www.cbr-xml-daily.ru/daily_json.js";
/** Курсы в БД моложе этого — свежие, сервис не запрашивается. ЦБ обновляет курсы раз в день. */
const maxAgeMs = 6 * 60 * 60 * 1000;
const requestTimeoutMs = 3000;
const foreignCurrencies = currencies.filter((currency) => currency !== "RUB");

function toSnapshot(rows: ExchangeRateRow[], isStale: boolean): ExchangeRatesSnapshot {
  const rates: ExchangeRates = { RUB: 1 };
  for (const row of rows) {
    rates[row.currency] = row.rubPerUnit;
  }
  const dates = rows.map((row) => row.ratesDate).sort();
  return { rates, ratesDate: dates[0] ?? null, isStale };
}

async function fetchCbrRates(): Promise<ParsedCbrRates | null> {
  try {
    const response = await fetch(cbrDailyUrl, { cache: "no-store", signal: AbortSignal.timeout(requestTimeoutMs) });
    if (!response.ok) {
      console.error(`Сервис курсов ответил ${response.status}`);
      return null;
    }
    const parsed = parseCbrResponse(await response.json());
    if (!parsed) {
      console.error("Сервис курсов вернул неожиданный ответ");
    }
    return parsed;
  } catch (error) {
    console.error("Сервис курсов недоступен:", error instanceof Error ? error.message : error);
    return null;
  }
}

async function saveRates({ ratesDate, rates }: ParsedCbrRates): Promise<ExchangeRateRow[]> {
  const values = foreignCurrencies.flatMap((currency) => {
    const rubPerUnit = rates[currency];
    return rubPerUnit ? [{ currency, rubPerUnit, ratesDate }] : [];
  });
  return db
    .insert(exchangeRates)
    .values(values)
    .onConflictDoUpdate({
      target: exchangeRates.currency,
      set: {
        rubPerUnit: sql`excluded.rub_per_unit`,
        ratesDate: sql`excluded.rates_date`,
        updatedAt: sql`now()`,
      },
    })
    .returning();
}

/**
 * Курсы ЦБ РФ: из БД, если они свежие, иначе — у сервиса с сохранением в БД.
 * Сервис недоступен — последний сохранённый курс (isStale). Кэшируется на время одного запроса.
 */
export const getExchangeRates = cache(async (): Promise<ExchangeRatesSnapshot> => {
  const stored = await db.select().from(exchangeRates);
  const isComplete = foreignCurrencies.every((currency) => stored.some((row) => row.currency === currency));
  const isFresh = isComplete && stored.every((row) => Date.now() - row.updatedAt.getTime() < maxAgeMs);
  if (isFresh) {
    return toSnapshot(stored, false);
  }

  const fetched = await fetchCbrRates();
  if (!fetched) {
    return toSnapshot(stored, stored.length > 0);
  }
  try {
    return toSnapshot(await saveRates(fetched), false);
  } catch (error) {
    console.error("Не удалось сохранить курсы:", error instanceof Error ? error.message : error);
    const rates: ExchangeRates = { RUB: 1, ...fetched.rates };
    return { rates, ratesDate: fetched.ratesDate, isStale: false };
  }
});
