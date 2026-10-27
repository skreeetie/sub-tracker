import { describe, expect, it } from "vitest";
import { parseCbrResponse } from "./parse-cbr-response";

const response = {
  Date: "2026-10-28T11:30:00+03:00",
  PreviousDate: "2026-10-25T11:30:00+03:00",
  Valute: {
    USD: { CharCode: "USD", Nominal: 1, Value: 80.5307, Previous: 80.4909 },
    KZT: { CharCode: "KZT", Nominal: 100, Value: 17.8541, Previous: 17.8452 },
    TRY: { CharCode: "TRY", Nominal: 10, Value: 16.1975, Previous: 16.2249 },
    AUD: { CharCode: "AUD", Nominal: 1, Value: 52.1, Previous: 52 },
  },
};

describe("parseCbrResponse", () => {
  it("берёт поддерживаемые валюты и делит на номинал", () => {
    const parsed = parseCbrResponse(response);
    expect(parsed?.ratesDate).toBe("2026-10-28");
    expect(Object.keys(parsed?.rates ?? {}).sort()).toEqual(["KZT", "TRY", "USD"]);
    expect(parsed?.rates.USD).toBeCloseTo(80.5307);
    expect(parsed?.rates.KZT).toBeCloseTo(0.178541);
    expect(parsed?.rates.TRY).toBeCloseTo(1.61975);
  });

  it.each([
    ["не объект", "oops"],
    ["нет Valute", { Date: "2026-10-28T11:30:00+03:00" }],
    ["кривая дата", { ...response, Date: "28.10.2026" }],
    ["отрицательный курс", { ...response, Valute: { USD: { Nominal: 1, Value: -1 } } }],
    ["нет нужных валют", { ...response, Valute: { AUD: { Nominal: 1, Value: 52.1 } } }],
  ])("%s → null", (_, data) => {
    expect(parseCbrResponse(data)).toBeNull();
  });
});
