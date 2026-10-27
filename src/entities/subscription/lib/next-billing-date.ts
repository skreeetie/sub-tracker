import { addMonths, formatIsoDate, monthsBetween, parseIsoDate, type IsoDate } from "@/shared/lib";
import type { BillingPeriod } from "../model/constants";

const periodInMonths: Record<BillingPeriod, number> = {
  monthly: 1,
  yearly: 12,
};

/**
 * Дата ближайшего списания, начиная с today включительно.
 * Списания идут в день начала подписки каждый период; каждая дата считается от startDate,
 * поэтому подписка с 31 января списывается 28/29 февраля, но 31 марта (а не 28-го).
 */
export function getNextBillingDate(startDate: IsoDate, billingPeriod: BillingPeriod, today: IsoDate): IsoDate {
  const start = parseIsoDate(startDate);
  const current = parseIsoDate(today);
  if (!start || !current) {
    throw new Error(`Некорректная дата: ${!start ? startDate : today}`);
  }
  if (startDate >= today) {
    return startDate;
  }

  const step = periodInMonths[billingPeriod];
  const periodsPassed = Math.floor(monthsBetween(start, current) / step);
  const candidate = formatIsoDate(addMonths(start, periodsPassed * step));
  return candidate >= today ? candidate : formatIsoDate(addMonths(start, (periodsPassed + 1) * step));
}
