import { daysBetween, parseIsoDate, type IsoDate } from "@/shared/lib";
import type { Subscription } from "../model/subscription";
import { getNextBillingDate } from "./billing-dates";

export interface UpcomingRenewal {
  subscription: Subscription;
  billingDate: IsoDate;
  /** 0 — сегодня, 1 — завтра и т. д. */
  daysUntil: number;
}

/**
 * Подписки, следующее списание которых не позже чем через withinDays дней (сегодня включительно),
 * по дате списания, затем по названию.
 */
export function getUpcomingRenewals(
  subscriptions: Subscription[],
  today: IsoDate,
  withinDays = 7,
): UpcomingRenewal[] {
  const current = parseIsoDate(today);
  if (!current) {
    throw new Error(`Некорректная дата: ${today}`);
  }

  return subscriptions
    .map((subscription) => {
      const billingDate = getNextBillingDate(subscription.startDate, subscription.billingPeriod, today);
      const billing = parseIsoDate(billingDate);
      return { subscription, billingDate, daysUntil: billing ? daysBetween(current, billing) : Infinity };
    })
    .filter((renewal) => renewal.daysUntil <= withinDays)
    .sort(
      (a, b) =>
        a.billingDate.localeCompare(b.billingDate) || a.subscription.name.localeCompare(b.subscription.name, "ru"),
    );
}
