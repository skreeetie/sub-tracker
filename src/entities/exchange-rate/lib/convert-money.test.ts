import { describe, expect, it } from "vitest";
import { convertMinor } from "./convert-money";

const rates = { USD: 80.5307, EUR: 90.0977, KZT: 0.178541 };

describe("convertMinor", () => {
  it("та же валюта — без изменений и без курсов", () => {
    expect(convertMinor(999, "USD", "USD", {})).toBe(999);
  });

  it("в рубли и из рублей", () => {
    expect(convertMinor(999, "USD", "RUB", rates)).toBe(80450); // 9,99 $ × 80,5307 = 804,5017 ₽
    expect(convertMinor(80450, "RUB", "USD", rates)).toBe(999);
  });

  it("между двумя иностранными валютами — через рубль", () => {
    expect(convertMinor(1000, "EUR", "USD", rates)).toBe(1119); // 10 € = 901,0 ₽ = 11,19 $
  });

  it("валюта с номиналом ЦБ (тенге за 100) — курс уже за единицу", () => {
    expect(convertMinor(500000, "KZT", "RUB", rates)).toBe(89271); // 5000 ₸ = 892,71 ₽
  });

  it("нет курса — null", () => {
    expect(convertMinor(1000, "GBP", "RUB", rates)).toBeNull();
    expect(convertMinor(1000, "RUB", "TRY", rates)).toBeNull();
  });
});
