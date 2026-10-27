import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  daysBetween,
  daysInMonth,
  formatDateLong,
  formatDateShort,
  formatDaysFromNow,
  formatIsoDate,
  formatMonthLong,
  formatMonthShort,
  getTodayIsoDate,
  monthsBetween,
  parseIsoDate,
  toIsoMonth,
} from "./date";

describe("parseIsoDate", () => {
  it("разбирает корректную дату", () => {
    expect(parseIsoDate("2026-10-27")).toEqual({ year: 2026, month: 10, day: 27 });
  });

  it("принимает 29 февраля високосного года", () => {
    expect(parseIsoDate("2024-02-29")).toEqual({ year: 2024, month: 2, day: 29 });
  });

  it.each(["2025-02-29", "2026-13-01", "2026-04-31", "2026-00-10", "27.10.2026", "2026-1-5", ""])(
    "отклоняет %j",
    (value) => {
      expect(parseIsoDate(value)).toBeNull();
    },
  );
});

describe("formatIsoDate", () => {
  it("дополняет нулями", () => {
    expect(formatIsoDate({ year: 2026, month: 3, day: 5 })).toBe("2026-03-05");
  });
});

describe("daysInMonth", () => {
  it.each([
    [2024, 2, 29],
    [2025, 2, 28],
    [2026, 4, 30],
    [2026, 12, 31],
  ])("%i-%i → %i", (year, month, days) => {
    expect(daysInMonth(year, month)).toBe(days);
  });
});

describe("addMonths", () => {
  it("прибавляет месяц внутри года", () => {
    expect(addMonths({ year: 2026, month: 3, day: 15 }, 1)).toEqual({ year: 2026, month: 4, day: 15 });
  });

  it("переходит через границу года", () => {
    expect(addMonths({ year: 2026, month: 12, day: 10 }, 1)).toEqual({ year: 2027, month: 1, day: 10 });
  });

  it("31 января + 1 месяц → последний день февраля", () => {
    expect(addMonths({ year: 2025, month: 1, day: 31 }, 1)).toEqual({ year: 2025, month: 2, day: 28 });
    expect(addMonths({ year: 2024, month: 1, day: 31 }, 1)).toEqual({ year: 2024, month: 2, day: 29 });
  });

  it("29 февраля + 12 месяцев → 28 февраля невисокосного года", () => {
    expect(addMonths({ year: 2024, month: 2, day: 29 }, 12)).toEqual({ year: 2025, month: 2, day: 28 });
  });

  it("29 февраля + 48 месяцев → снова 29 февраля", () => {
    expect(addMonths({ year: 2024, month: 2, day: 29 }, 48)).toEqual({ year: 2028, month: 2, day: 29 });
  });
});

describe("monthsBetween", () => {
  it("считает разницу по номерам месяцев", () => {
    expect(monthsBetween({ year: 2025, month: 11, day: 30 }, { year: 2026, month: 2, day: 1 })).toBe(3);
  });
});

describe("getTodayIsoDate", () => {
  // 2026-10-27T22:30:00Z — в Москве (UTC+3) уже 28 октября.
  const now = new Date("2026-10-27T22:30:00Z");

  it("учитывает часовой пояс", () => {
    expect(getTodayIsoDate("Europe/Moscow", now)).toBe("2026-10-28");
    expect(getTodayIsoDate("UTC", now)).toBe("2026-10-27");
  });
});

describe("formatDateLong", () => {
  it("форматирует дату по-русски", () => {
    expect(formatDateLong("2026-10-29", "ru-RU")).toBe("29 октября 2026 г.");
  });
});

describe("addDays", () => {
  it("переходит через конец месяца и года", () => {
    expect(addDays({ year: 2026, month: 10, day: 27 }, 7)).toEqual({ year: 2026, month: 11, day: 3 });
    expect(addDays({ year: 2026, month: 12, day: 30 }, 3)).toEqual({ year: 2027, month: 1, day: 2 });
  });

  it("учитывает 29 февраля", () => {
    expect(addDays({ year: 2028, month: 2, day: 28 }, 1)).toEqual({ year: 2028, month: 2, day: 29 });
    expect(addDays({ year: 2027, month: 2, day: 28 }, 1)).toEqual({ year: 2027, month: 3, day: 1 });
  });

  it("отнимает дни", () => {
    expect(addDays({ year: 2026, month: 3, day: 1 }, -1)).toEqual({ year: 2026, month: 2, day: 28 });
  });
});

describe("daysBetween", () => {
  it("считает календарные дни", () => {
    expect(daysBetween({ year: 2026, month: 10, day: 27 }, { year: 2026, month: 11, day: 3 })).toBe(7);
    expect(daysBetween({ year: 2026, month: 10, day: 27 }, { year: 2026, month: 10, day: 27 })).toBe(0);
    expect(daysBetween({ year: 2026, month: 10, day: 27 }, { year: 2026, month: 10, day: 20 })).toBe(-7);
  });

  it("через переход на летнее время не сбивается (расчёт в UTC)", () => {
    expect(daysBetween({ year: 2026, month: 3, day: 28 }, { year: 2026, month: 3, day: 30 })).toBe(2);
  });
});

describe("toIsoMonth", () => {
  it("отрезает день", () => {
    expect(toIsoMonth("2026-10-29")).toBe("2026-10");
  });
});

describe("форматирование месяцев и коротких дат", () => {
  it("короткий месяц", () => {
    expect(formatMonthShort("2026-10", "ru-RU")).toBe("окт.");
  });

  it("месяц с годом", () => {
    expect(formatMonthLong("2026-10", "ru-RU")).toBe("октябрь 2026 г.");
  });

  it("день и короткий месяц", () => {
    expect(formatDateShort("2026-11-03", "ru-RU")).toBe("3 нояб.");
  });
});

describe("formatDaysFromNow", () => {
  it.each([
    [0, "сегодня"],
    [1, "завтра"],
    [2, "послезавтра"],
    [3, "через 3 дня"],
    [5, "через 5 дней"],
  ])("%i → %j", (days, expected) => {
    expect(formatDaysFromNow(days, "ru-RU")).toBe(expected);
  });
});
