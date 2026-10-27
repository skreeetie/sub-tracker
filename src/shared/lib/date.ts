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

/** Месяц в формате "YYYY-MM". */
export type IsoMonth = string;

function toUtcDate({ year, month, day }: CalendarDate): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

function fromUtcDate(date: Date): CalendarDate {
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

export function addDays(date: CalendarDate, days: number): CalendarDate {
  const result = toUtcDate(date);
  result.setUTCDate(result.getUTCDate() + days);
  return fromUtcDate(result);
}

const msPerDay = 24 * 60 * 60 * 1000;

/** Количество календарных дней от from до to (отрицательное, если to раньше). */
export function daysBetween(from: CalendarDate, to: CalendarDate): number {
  return Math.round((toUtcDate(to).getTime() - toUtcDate(from).getTime()) / msPerDay);
}

/** "2026-10-29" → "2026-10" */
export function toIsoMonth(value: IsoDate): IsoMonth {
  return value.slice(0, 7);
}

function monthToUtcDate(value: IsoMonth): Date | null {
  const date = parseIsoDate(`${value}-01`);
  return date ? toUtcDate(date) : null;
}

/** "2026-10" → "окт." */
export function formatMonthShort(value: IsoMonth, locale: string = appLocale): string {
  const date = monthToUtcDate(value);
  return date ? new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" }).format(date) : value;
}

/** "2026-10" → "октябрь 2026 г." */
export function formatMonthLong(value: IsoMonth, locale: string = appLocale): string {
  const date = monthToUtcDate(value);
  return date
    ? new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(date)
    : value;
}

/** "2026-10-29" → "29 окт." */
export function formatDateShort(value: IsoDate, locale: string = appLocale): string {
  const date = parseIsoDate(value);
  return date
    ? new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", timeZone: "UTC" }).format(toUtcDate(date))
    : value;
}

/** 0 → "сегодня", 1 → "завтра", 5 → "через 5 дней" */
export function formatDaysFromNow(days: number, locale: string = appLocale): string {
  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(days, "day");
}
