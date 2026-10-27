import { appLocale } from "@/shared/config";

/** Календарная дата без времени в формате "YYYY-MM-DD". */
export type IsoDate = string;

export interface CalendarDate {
  year: number;
  /** 1–12 */
  month: number;
  day: number;
}

const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Разбирает "YYYY-MM-DD"; для несуществующих дат (2025-02-30) возвращает null. */
export function parseIsoDate(value: string): CalendarDate | null {
  const match = isoDatePattern.exec(value);
  if (!match) {
    return null;
  }
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    return null;
  }
  return { year, month, day };
}

export function formatIsoDate({ year, month, day }: CalendarDate): IsoDate {
  return [String(year).padStart(4, "0"), String(month).padStart(2, "0"), String(day).padStart(2, "0")].join("-");
}

/**
 * Прибавляет месяцы. Если такого дня в целевом месяце нет, берётся последний день:
 * 31 января + 1 месяц = 28 (29) февраля.
 */
export function addMonths(date: CalendarDate, months: number): CalendarDate {
  const monthIndex = date.year * 12 + (date.month - 1) + months;
  const year = Math.floor(monthIndex / 12);
  const month = (monthIndex % 12) + 1;
  return { year, month, day: Math.min(date.day, daysInMonth(year, month)) };
}

/** Количество целых календарных месяцев между датами по номеру месяца (без учёта дней). */
export function monthsBetween(from: CalendarDate, to: CalendarDate): number {
  return (to.year - from.year) * 12 + (to.month - from.month);
}

/** Сегодняшняя дата в заданном часовом поясе. */
export function getTodayIsoDate(timeZone: string, now: Date = new Date()): IsoDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

/** "29 октября 2026" */
export function formatDateLong(value: IsoDate, locale: string = appLocale): string {
  const date = parseIsoDate(value);
  if (!date) {
    return value;
  }
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(date.year, date.month - 1, date.day)));
}
