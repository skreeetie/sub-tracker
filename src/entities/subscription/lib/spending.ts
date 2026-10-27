import { addMonths, formatIsoDate, parseIsoDate, toIsoMonth, type IsoDate, type IsoMonth } from "@/shared/lib";
import { subscriptionCategories, type SubscriptionCategory } from "../model/constants";
import type { Subscription } from "../model/subscription";
import { getBillingDatesInRange } from "./billing-dates";

type PricedSubscription = Pick<Subscription, "priceMinor" | "billingPeriod">;

/** Стоимость подписки за год в копейках: ежемесячная × 12, ежегодная — как есть. */
export function getYearlyCostMinor({ priceMinor, billingPeriod }: PricedSubscription): number {
  return billingPeriod === "monthly" ? priceMinor * 12 : priceMinor;
}

/**
 * Месячная нагрузка в копейках: годовые подписки приводятся к месяцу как цена / 12.
 * Считается от суммы за год и округляется один раз — так копейки не теряются на каждой подписке.
 */
function toMonthlyMinor(yearlyMinor: number): number {
  return Math.round(yearlyMinor / 12);
}

export interface SpendingSummary {
  activeCount: number;
  monthlyMinor: number;
  yearlyMinor: number;
}

export function getSpendingSummary(subscriptions: PricedSubscription[]): SpendingSummary {
  const yearlyMinor = subscriptions.reduce((sum, subscription) => sum + getYearlyCostMinor(subscription), 0);
  return { activeCount: subscriptions.length, monthlyMinor: toMonthlyMinor(yearlyMinor), yearlyMinor };
}

export interface CategorySpending {
  category: SubscriptionCategory;
  monthlyMinor: number;
}

/** Месячная нагрузка по категориям — только непустые, от большей к меньшей. */
export function getSpendingByCategory(
  subscriptions: Pick<Subscription, "priceMinor" | "billingPeriod" | "category">[],
): CategorySpending[] {
  const yearlyByCategory = new Map<SubscriptionCategory, number>();
  for (const subscription of subscriptions) {
    yearlyByCategory.set(
      subscription.category,
      (yearlyByCategory.get(subscription.category) ?? 0) + getYearlyCostMinor(subscription),
    );
  }

  return subscriptionCategories
    .filter((category) => yearlyByCategory.has(category))
    .map((category) => ({ category, monthlyMinor: toMonthlyMinor(yearlyByCategory.get(category) ?? 0) }))
    .sort((a, b) => b.monthlyMinor - a.monthlyMinor);
}

export interface MonthSpending {
  month: IsoMonth;
  totalMinor: number;
}

/**
 * Фактические списания по месяцам за последние monthCount месяцев, включая текущий, от старых к новым.
 * Учитываются только списания по today включительно; годовая подписка — целиком в месяце списания.
 */
export function getSpendingByMonth(
  subscriptions: Pick<Subscription, "priceMinor" | "billingPeriod" | "startDate">[],
  today: IsoDate,
  monthCount = 12,
): MonthSpending[] {
  const current = parseIsoDate(today);
  if (!current) {
    throw new Error(`Некорректная дата: ${today}`);
  }

  const firstMonth = addMonths({ ...current, day: 1 }, -(monthCount - 1));
  const totals = new Map<IsoMonth, number>();
  for (let index = 0; index < monthCount; index += 1) {
    totals.set(toIsoMonth(formatIsoDate(addMonths(firstMonth, index))), 0);
  }

  const from = formatIsoDate(firstMonth);
  for (const subscription of subscriptions) {
    for (const date of getBillingDatesInRange(subscription.startDate, subscription.billingPeriod, from, today)) {
      const month = toIsoMonth(date);
      totals.set(month, (totals.get(month) ?? 0) + subscription.priceMinor);
    }
  }

  return [...totals].map(([month, totalMinor]) => ({ month, totalMinor }));
}
