import { appCurrency, appLocale } from "@/shared/config";

const moneyInputPattern = /^(\d+)(?:[.,](\d{1,2}))?$/;

/**
 * Разбирает сумму, введённую пользователем ("399", "399,9", "1 299.90"), в копейки.
 * Возвращает null, если строка не похожа на сумму с не более чем двумя знаками после запятой.
 */
export function parseMoneyToMinor(input: string): number | null {
  const normalized = input.replace(/\s/g, "");
  const match = moneyInputPattern.exec(normalized);
  if (!match) {
    return null;
  }
  const rubles = Number(match[1]);
  const kopecks = Number((match[2] ?? "").padEnd(2, "0"));
  return rubles * 100 + kopecks;
}

/** 39900 → "399 ₽", 39990 → "399,90 ₽" */
export function formatMoney(minor: number, locale: string = appLocale, currency: string = appCurrency): string {
  const hasKopecks = minor % 100 !== 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: hasKopecks ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(minor / 100);
}
