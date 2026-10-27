import { convertMinor, type ExchangeRates } from "@/entities/exchange-rate";
import type { Subscription } from "@/entities/subscription";
import type { Currency } from "@/shared/config";

export interface ConvertedSubscriptions {
  /** Подписки с ценой, пересчитанной в основную валюту. */
  converted: Subscription[];
  /** Подписки, для валюты которых нет курса: в итоги не входят. */
  unconverted: Subscription[];
}

/** Приводит цены к одной валюте — после этого агрегации считают в ней. */
export function convertSubscriptions(
  subscriptions: Subscription[],
  currency: Currency,
  rates: ExchangeRates,
): ConvertedSubscriptions {
  const result: ConvertedSubscriptions = { converted: [], unconverted: [] };
  for (const subscription of subscriptions) {
    const priceMinor = convertMinor(subscription.priceMinor, subscription.currency, currency, rates);
    if (priceMinor === null) {
      result.unconverted.push(subscription);
    } else {
      result.converted.push({ ...subscription, priceMinor, currency });
    }
  }
  return result;
}
