import { describe, expect, it } from "vitest";
import { validateSubscriptionForm } from "./form-schema";

const validValues = {
  name: "  Музыка  ",
  price: "199,90",
  currency: "USD",
  billingPeriod: "monthly",
  category: "music",
  startDate: "2026-01-31",
};

describe("validateSubscriptionForm", () => {
  it("возвращает нормализованные данные для корректной формы", () => {
    expect(validateSubscriptionForm(validValues)).toEqual({
      success: true,
      data: {
        name: "Музыка",
        priceMinor: 19990,
        currency: "USD",
        billingPeriod: "monthly",
        category: "music",
        startDate: "2026-01-31",
      },
    });
  });

  it("собирает ошибки по всем пустым полям", () => {
    const result = validateSubscriptionForm({
      name: " ",
      price: "",
      currency: "",
      billingPeriod: "",
      category: "",
      startDate: "",
    });
    expect(result).toEqual({
      success: false,
      errors: {
        name: "Укажите название сервиса",
        price: "Укажите стоимость",
        currency: "Выберите валюту",
        billingPeriod: "Выберите период оплаты",
        category: "Выберите категорию",
        startDate: "Укажите дату начала",
      },
    });
  });

  it("сообщает об отсутствующих полях", () => {
    const result = validateSubscriptionForm({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(result.errors).sort()).toEqual(
        ["billingPeriod", "category", "currency", "name", "price", "startDate"].sort(),
      );
    }
  });

  it.each([
    ["abc", "Введите сумму числом, например 399 или 399,90"],
    ["1,999", "Введите сумму числом, например 399 или 399,90"],
    ["-5", "Введите сумму числом, например 399 или 399,90"],
    ["0", "Стоимость должна быть больше нуля"],
    ["0,00", "Стоимость должна быть больше нуля"],
    ["1000000,01", "Стоимость не больше 1 000 000"],
  ])("цена %j → «%s»", (price, message) => {
    expect(validateSubscriptionForm({ ...validValues, price })).toEqual({
      success: false,
      errors: { price: message },
    });
  });

  it("принимает максимальную цену", () => {
    expect(validateSubscriptionForm({ ...validValues, price: "1000000" }).success).toBe(true);
  });

  it("отклоняет слишком длинное название", () => {
    expect(validateSubscriptionForm({ ...validValues, name: "а".repeat(101) })).toEqual({
      success: false,
      errors: { name: "Не длиннее 100 символов" },
    });
  });

  it.each(["2025-02-29", "31.01.2026", "1999-12-31", "2101-01-01"])("отклоняет дату %j", (startDate) => {
    expect(validateSubscriptionForm({ ...validValues, startDate })).toEqual({
      success: false,
      errors: { startDate: "Укажите корректную дату начала" },
    });
  });

  it("отклоняет неизвестную валюту", () => {
    expect(validateSubscriptionForm({ ...validValues, currency: "JPY" })).toEqual({
      success: false,
      errors: { currency: "Выберите валюту" },
    });
  });

  it("отклоняет неизвестные период и категорию", () => {
    expect(validateSubscriptionForm({ ...validValues, billingPeriod: "weekly", category: "food" })).toEqual({
      success: false,
      errors: { billingPeriod: "Выберите период оплаты", category: "Выберите категорию" },
    });
  });
});
