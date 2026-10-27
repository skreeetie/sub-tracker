import { describe, expect, it } from "vitest";
import { getBillingDatesInRange, getNextBillingDate } from "./billing-dates";

describe("getNextBillingDate — ежемесячно", () => {
  it("будущая дата начала — первое списание в день начала", () => {
    expect(getNextBillingDate("2026-11-05", "monthly", "2026-10-27")).toBe("2026-11-05");
  });

  it("сегодняшняя дата начала — списание сегодня", () => {
    expect(getNextBillingDate("2026-10-27", "monthly", "2026-10-27")).toBe("2026-10-27");
  });

  it("день списания в этом месяце ещё не наступил", () => {
    expect(getNextBillingDate("2026-03-29", "monthly", "2026-10-27")).toBe("2026-10-29");
  });

  it("день списания в этом месяце уже прошёл — следующий месяц", () => {
    expect(getNextBillingDate("2026-03-15", "monthly", "2026-10-27")).toBe("2026-11-15");
  });

  it("списание сегодня считается ближайшим", () => {
    expect(getNextBillingDate("2026-03-27", "monthly", "2026-10-27")).toBe("2026-10-27");
  });

  it("переход через границу года", () => {
    expect(getNextBillingDate("2025-06-10", "monthly", "2026-12-20")).toBe("2027-01-10");
  });

  it("31-е число в коротком месяце — последний день месяца", () => {
    expect(getNextBillingDate("2026-01-31", "monthly", "2026-02-10")).toBe("2026-02-28");
    expect(getNextBillingDate("2026-01-31", "monthly", "2026-04-02")).toBe("2026-04-30");
  });

  it("после короткого месяца возвращается к 31-му числу", () => {
    expect(getNextBillingDate("2026-01-31", "monthly", "2026-03-01")).toBe("2026-03-31");
  });

  it("31 января в високосный год — 29 февраля", () => {
    expect(getNextBillingDate("2028-01-31", "monthly", "2028-02-01")).toBe("2028-02-29");
  });
});

describe("getNextBillingDate — ежегодно", () => {
  it("в этом году дата ещё впереди", () => {
    expect(getNextBillingDate("2024-12-03", "yearly", "2026-10-27")).toBe("2026-12-03");
  });

  it("в этом году дата уже прошла — следующий год", () => {
    expect(getNextBillingDate("2024-05-01", "yearly", "2026-10-27")).toBe("2027-05-01");
  });

  it("тот же месяц, день уже прошёл", () => {
    expect(getNextBillingDate("2025-10-10", "yearly", "2026-10-27")).toBe("2027-10-10");
  });

  it("29 февраля → 28 февраля в невисокосный год", () => {
    expect(getNextBillingDate("2024-02-29", "yearly", "2026-01-15")).toBe("2026-02-28");
  });

  it("29 февраля → снова 29 февраля в високосный год", () => {
    expect(getNextBillingDate("2024-02-29", "yearly", "2027-03-01")).toBe("2028-02-29");
  });
});

describe("getNextBillingDate — ошибки", () => {
  it("падает на некорректной дате", () => {
    expect(() => getNextBillingDate("2026-02-30", "monthly", "2026-10-27")).toThrow(/2026-02-30/);
  });
});

describe("getBillingDatesInRange", () => {
  it("ежемесячные списания в диапазоне, включая границы", () => {
    expect(getBillingDatesInRange("2026-01-15", "monthly", "2026-03-15", "2026-06-15")).toEqual([
      "2026-03-15",
      "2026-04-15",
      "2026-05-15",
      "2026-06-15",
    ]);
  });

  it("не возвращает списаний до даты начала", () => {
    expect(getBillingDatesInRange("2026-05-10", "monthly", "2026-01-01", "2026-07-31")).toEqual([
      "2026-05-10",
      "2026-06-10",
      "2026-07-10",
    ]);
  });

  it("подписка начинается после диапазона — списаний нет", () => {
    expect(getBillingDatesInRange("2026-12-01", "monthly", "2026-01-01", "2026-11-30")).toEqual([]);
  });

  it("31-е число — последний день коротких месяцев", () => {
    expect(getBillingDatesInRange("2026-01-31", "monthly", "2026-02-01", "2026-04-30")).toEqual([
      "2026-02-28",
      "2026-03-31",
      "2026-04-30",
    ]);
  });

  it("ежегодная подписка — одно списание в год", () => {
    expect(getBillingDatesInRange("2023-03-20", "yearly", "2025-11-01", "2026-10-31")).toEqual(["2026-03-20"]);
  });

  it("29 февраля в ежегодной подписке", () => {
    expect(getBillingDatesInRange("2024-02-29", "yearly", "2024-01-01", "2028-12-31")).toEqual([
      "2024-02-29",
      "2025-02-28",
      "2026-02-28",
      "2027-02-28",
      "2028-02-29",
    ]);
  });

  it("согласуется с getNextBillingDate", () => {
    const [first] = getBillingDatesInRange("2026-01-31", "monthly", "2026-02-10", "2026-12-31");
    expect(first).toBe(getNextBillingDate("2026-01-31", "monthly", "2026-02-10"));
  });
});
