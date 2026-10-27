import { addMonths, formatIsoDate, monthsBetween, parseIsoDate, type IsoDate } from "@/shared/lib";
import type { BillingPeriod } from "../model/constants";

const periodInMonths: Record<BillingPeriod, number> = {
  monthly: 1,
  yearly: 12,
};

function parseOrThrow(value: IsoDate) {
  const date = parseIsoDate(value);
  if (!date) {
    throw new Error(`Некорректная дата: ${value}`);
  }
  return date;
}

/**
 * Дата ближайшего списания, начиная с today включительно.
 * Списания идут в день начала подписки каждый период; каждая дата считается от startDate,
 * поэтому подписка с 31 января списывается 28/29 февраля, но 31 марта (а не 28-го).
 */
export function getNextBillingDate(startDate: IsoDate, billingPeriod: BillingPeriod, today: IsoDate): IsoDate {
  const start = parseOrThrow(startDate);
  const current = parseOrThrow(today);
  if (startDate >= today) {
    return startDate;
  }

  const step = periodInMonths[billingPeriod];
  const periodsPassed = Math.floor(monthsBetween(start, current) / step);
  const candidate = formatIsoDate(addMonths(start, periodsPassed * step));
  return candidate >= today ? candidate : formatIsoDate(addMonths(start, (periodsPassed + 1) * step));
}

/** Все даты списаний в диапазоне [from, to] включительно, по возрастанию. */
export function getBillingDatesInRange(
  startDate: IsoDate,
  billingPeriod: BillingPeriod,
  from: IsoDate,
  to: IsoDate,
): IsoDate[] {
  const start = parseOrThrow(startDate);
  const rangeStart = parseOrThrow(from);
  parseOrThrow(to);

  const step = periodInMonths[billingPeriod];
  // Начинаем на период раньше from: из-за «последнего дня месяца» номер периода по месяцам может опережать дату.
  let periodIndex = Math.max(0, Math.floor(monthsBetween(start, rangeStart) / step) - 1);
  const dates: IsoDate[] = [];
  for (;;) {
    const date = formatIsoDate(addMonths(start, periodIndex * step));
    if (date > to) {
      return dates;
    }
    if (date >= from) {
      dates.push(date);
    }
    periodIndex += 1;
  }
}
