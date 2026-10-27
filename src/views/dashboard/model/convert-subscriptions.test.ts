import { describe, expect, it } from "vitest";
import type { Subscription } from "@/entities/subscription";
import { convertSubscriptions } from "./convert-subscriptions";

const base = { billingPeriod: "monthly", category: "video", startDate: "2026-01-01" } as const;
const rub: Subscription = { ...base, id: "1", name: "Кино", priceMinor: 39900, currency: "RUB" };
const usd: Subscription = { ...base, id: "2", name: "Music", priceMinor: 999, currency: "USD" };
const gbp: Subscription = { ...base, id: "3", name: "News", priceMinor: 500, currency: "GBP" };

describe("convertSubscriptions", () => {
  it("пересчитывает цены в основную валюту", () => {
    const { converted, unconverted } = convertSubscriptions([rub, usd], "RUB", { USD: 80 });
    expect(converted.map((item) => [item.priceMinor, item.currency])).toEqual([
      [39900, "RUB"],
      [79920, "RUB"],
    ]);
    expect(unconverted).toEqual([]);
  });

  it("без курса подписка не входит в итоги", () => {
    const { converted, unconverted } = convertSubscriptions([rub, gbp], "RUB", {});
    expect(converted).toEqual([rub]);
    expect(unconverted).toEqual([gbp]);
  });

  it("основная валюта не рубль", () => {
    const { converted } = convertSubscriptions([rub], "USD", { USD: 80 });
    expect(converted[0]).toMatchObject({ priceMinor: 499, currency: "USD" });
  });
});
