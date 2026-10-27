import { describe, expect, it } from "vitest";
import type { Subscription } from "../model/subscription";
import { getUpcomingRenewals } from "./upcoming-renewals";

function subscription(name: string, startDate: string, billingPeriod: Subscription["billingPeriod"] = "monthly") {
  return { id: name, name, priceMinor: 10000, currency: "RUB", billingPeriod, category: "other", startDate } satisfies Subscription;
}

const today = "2026-10-27";

describe("getUpcomingRenewals", () => {
  it("берёт списания с сегодня по 7-й день включительно", () => {
    const result = getUpcomingRenewals(
      [
        subscription("сегодня", "2026-01-27"),
        subscription("через 7 дней", "2026-01-03"),
        subscription("через 8 дней", "2026-01-04"),
        subscription("вчера", "2026-01-26"),
      ],
      today,
    );
    expect(result.map((item) => [item.subscription.name, item.billingDate, item.daysUntil])).toEqual([
      ["сегодня", "2026-10-27", 0],
      ["через 7 дней", "2026-11-03", 7],
    ]);
  });

  it("сортирует по дате, затем по названию", () => {
    const result = getUpcomingRenewals(
      [subscription("Видео", "2026-05-30"), subscription("Облако", "2026-05-29"), subscription("Аудио", "2026-05-30")],
      today,
    );
    expect(result.map((item) => item.subscription.name)).toEqual(["Облако", "Аудио", "Видео"]);
  });

  it("учитывает годовые подписки и будущую дату начала", () => {
    const result = getUpcomingRenewals(
      [subscription("Годовая", "2024-10-30", "yearly"), subscription("Новая", "2026-11-01")],
      today,
    );
    expect(result.map((item) => [item.subscription.name, item.daysUntil])).toEqual([
      ["Годовая", 3],
      ["Новая", 5],
    ]);
  });

  it("можно задать другой горизонт", () => {
    expect(getUpcomingRenewals([subscription("Через 3 дня", "2026-01-30")], today, 2)).toEqual([]);
  });
});
