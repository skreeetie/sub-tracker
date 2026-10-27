import { describe, expect, it } from "vitest";
import { readSubscriptionFormValues, toSubscriptionFormValues } from "./form-state";

describe("readSubscriptionFormValues", () => {
  it("берёт только поля формы и только строки", () => {
    const formData = new FormData();
    formData.set("name", "Музыка");
    formData.set("price", "199");
    formData.set("startDate", "2026-01-31");
    formData.set("$ACTION_ID_abc", "");
    formData.set("category", new Blob(["video"]));

    expect(readSubscriptionFormValues(formData)).toEqual({
      name: "Музыка",
      price: "199",
      startDate: "2026-01-31",
    });
  });
});

describe("toSubscriptionFormValues", () => {
  it("переводит подписку в значения формы", () => {
    expect(
      toSubscriptionFormValues({
        id: "0b6f1c5e-7f43-4d2a-9a52-2a3c4d5e6f70",
        name: "Облако",
        priceMinor: 14990,
        billingPeriod: "yearly",
        category: "cloud",
        startDate: "2025-03-01",
      }),
    ).toEqual({
      name: "Облако",
      price: "149,90",
      billingPeriod: "yearly",
      category: "cloud",
      startDate: "2025-03-01",
    });
  });
});
