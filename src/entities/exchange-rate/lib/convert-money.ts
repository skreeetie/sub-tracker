import type { Currency } from "@/shared/config";
import type { ExchangeRates } from "../model/exchange-rates";

function rubPerUnit(currency: Currency, rates: ExchangeRates): number | undefined {
  return currency === "RUB" ? 1 : rates[currency];
}

/**
 * Пересчитывает сумму в минимальных единицах между валютами через рубль, с округлением до минимальной единицы.
 * null — если для одной из валют нет курса.
 */
export function convertMinor(amountMinor: number, from: Currency, to: Currency, rates: ExchangeRates): number | null {
  if (from === to) {
    return amountMinor;
  }
  const fromRate = rubPerUnit(from, rates);
  const toRate = rubPerUnit(to, rates);
  if (!fromRate || !toRate) {
    return null;
  }
  return Math.round((amountMinor * fromRate) / toRate);
}
