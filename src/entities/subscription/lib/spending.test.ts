import { describe, expect, it } from "vitest";
import { getSpendingByCategory, getSpendingByMonth, getSpendingSummary, getYearlyCostMinor } from "./spending";

describe("getYearlyCostMinor", () => {
  it("ежемесячная × 12, ежегодная как есть", () => {
    expect(getYearlyCostMinor({ priceMinor: 39900, billingPeriod: "monthly" })).toBe(478800);
    expect(getYearlyCostMinor({ priceMinor: 599000, billingPeriod: "yearly" })).toBe(599000);
  });
});

describe("getSpendingSummary", () => {
  it("пустой список — нули", () => {
    expect(getSpendingSummary([])).toEqual({ activeCount: 0, monthlyMinor: 0, yearlyMinor: 0 });
  });

  it("годовая подписка приводится к месяцу как цена / 12", () => {
    expect(
      getSpendingSummary([
        { priceMinor: 39900, billingPeriod: "monthly" },
        { priceMinor: 120000, billingPeriod: "yearly" },
      ]),
    ).toEqual({ activeCount: 2, monthlyMinor: 49900, yearlyMinor: 598800 });
  });

  it("округляет месячную сумму до копейки один раз, от общей суммы", () => {
    // 3 × 100 ₽ в год = 300 ₽ / 12 = 25 ₽ ровно; по отдельности 8,33 × 3 = 24,99.
    const yearly = { priceMinor: 10000, billingPeriod: "yearly" } as const;
    expect(getSpendingSummary([yearly, yearly, yearly]).monthlyMinor).toBe(2500);
  });
});

describe("getSpendingByCategory", () => {
  it("группирует месячную нагрузку и сортирует по убыванию", () => {
    expect(
      getSpendingByCategory([
        { priceMinor: 19900, billingPeriod: "monthly", category: "music" },
        { priceMinor: 39900, billingPeriod: "monthly", category: "video" },
        { priceMinor: 29900, billingPeriod: "monthly", category: "video" },
        { priceMinor: 599000, billingPeriod: "yearly", category: "education" },
      ]),
    ).toEqual([
      { category: "video", monthlyMinor: 69800 },
      { category: "education", monthlyMinor: 49917 },
      { category: "music", monthlyMinor: 19900 },
    ]);
  });

  it("при равных суммах — порядок категорий из справочника", () => {
    expect(
      getSpendingByCategory([
        { priceMinor: 10000, billingPeriod: "monthly", category: "other" },
        { priceMinor: 10000, billingPeriod: "monthly", category: "cloud" },
      ]).map((item) => item.category),
    ).toEqual(["cloud", "other"]);
  });

  it("пустой список — пустой результат", () => {
    expect(getSpendingByCategory([])).toEqual([]);
  });
});

describe("getSpendingByMonth", () => {
  const today = "2026-10-27";

  it("12 месяцев от старых к новым, включая текущий", () => {
    const months = getSpendingByMonth([], today).map((item) => item.month);
    expect(months).toHaveLength(12);
    expect(months[0]).toBe("2025-11");
    expect(months.at(-1)).toBe("2026-10");
    expect(getSpendingByMonth([], today).every((item) => item.totalMinor === 0)).toBe(true);
  });

  it("ежемесячная подписка — списание в каждом месяце после начала", () => {
    const result = getSpendingByMonth([{ priceMinor: 39900, billingPeriod: "monthly", startDate: "2026-07-05" }], today);
    expect(result.filter((item) => item.totalMinor > 0).map((item) => item.month)).toEqual([
      "2026-07",
      "2026-08",
      "2026-09",
      "2026-10",
    ]);
  });

  it("годовая подписка — целиком в месяце списания", () => {
    const result = getSpendingByMonth([{ priceMinor: 599000, billingPeriod: "yearly", startDate: "2024-03-20" }], today);
    expect(result.find((item) => item.month === "2026-03")?.totalMinor).toBe(599000);
    expect(result.reduce((sum, item) => sum + item.totalMinor, 0)).toBe(599000);
  });

  it("будущие списания текущего месяца не учитываются", () => {
    const result = getSpendingByMonth([{ priceMinor: 19900, billingPeriod: "monthly", startDate: "2026-01-29" }], today);
    expect(result.at(-1)).toEqual({ month: "2026-10", totalMinor: 0 });
    expect(result.at(-2)).toEqual({ month: "2026-09", totalMinor: 19900 });
  });

  it("списание сегодня учитывается", () => {
    const result = getSpendingByMonth([{ priceMinor: 19900, billingPeriod: "monthly", startDate: "2026-02-27" }], today);
    expect(result.at(-1)?.totalMinor).toBe(19900);
  });

  it("месяц до периода не попадает, даже если подписка старая", () => {
    const result = getSpendingByMonth([{ priceMinor: 10000, billingPeriod: "monthly", startDate: "2020-01-01" }], today);
    expect(result.every((item) => item.totalMinor === 10000)).toBe(true);
  });

  it("суммирует несколько подписок в одном месяце", () => {
    const result = getSpendingByMonth(
      [
        { priceMinor: 10000, billingPeriod: "monthly", startDate: "2026-10-01" },
        { priceMinor: 5000, billingPeriod: "yearly", startDate: "2025-10-10" },
      ],
      today,
    );
    expect(result.at(-1)?.totalMinor).toBe(15000);
    expect(result.at(-1)).toEqual({ month: "2026-10", totalMinor: 15000 });
  });
});
