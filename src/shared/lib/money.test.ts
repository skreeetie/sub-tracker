import { describe, expect, it } from "vitest";
import { formatMoney, formatMoneyCompact, formatMoneyInput, parseMoneyToMinor } from "./money";

// Intl ставит неразрывные пробелы — для сравнения заменяем их обычными.
const normalizeSpaces = (value: string) => value.replace(/\s/g, " ");

describe("parseMoneyToMinor", () => {
  it.each([
    ["399", 39900],
    ["399,9", 39990],
    ["399.90", 39990],
    ["0,5", 50],
    ["1 299,00", 129900],
    [" 149 ", 14900],
  ])("%j → %i копеек", (input, expected) => {
    expect(parseMoneyToMinor(input)).toBe(expected);
  });

  it.each(["", "abc", "1,999", "-100", "1e3", "12,", ",50", "10,5,0"])("отклоняет %j", (input) => {
    expect(parseMoneyToMinor(input)).toBeNull();
  });
});

describe("formatMoney", () => {
  it("без копеек — целое число", () => {
    expect(normalizeSpaces(formatMoney(39900, "RUB"))).toBe("399 ₽");
  });

  it("с копейками — два знака", () => {
    expect(normalizeSpaces(formatMoney(39990, "RUB"))).toBe("399,90 ₽");
  });

  it("разделяет тысячи", () => {
    expect(normalizeSpaces(formatMoney(599000, "RUB"))).toBe("5 990 ₽");
  });

  it.each([
    ["USD", "9,99 $"],
    ["EUR", "9,99 €"],
    ["GBP", "9,99 £"],
    ["CNY", "9,99 ¥"],
    ["KZT", "9,99 ₸"],
    ["TRY", "9,99 ₺"],
  ] as const)("валюта %s → %j", (currency, expected) => {
    expect(normalizeSpaces(formatMoney(999, currency))).toBe(expected);
  });
});

describe("formatMoneyInput", () => {
  it.each([
    [39900, "399"],
    [39990, "399,90"],
    [39905, "399,05"],
    [50, "0,50"],
    [129900, "1299"],
  ])("%i копеек → %j", (minor, expected) => {
    expect(formatMoneyInput(minor)).toBe(expected);
  });

  it.each([39900, 39990, 5, 100_000_000])("разбирается обратно в те же %i копеек", (minor) => {
    expect(parseMoneyToMinor(formatMoneyInput(minor))).toBe(minor);
  });
});

describe("formatMoneyCompact", () => {
  it.each([
    [50000, "500 ₽"],
    [123400, "1,2 тыс. ₽"],
    [1250000, "12,5 тыс. ₽"],
  ])("%i копеек → %j", (minor, expected) => {
    expect(normalizeSpaces(formatMoneyCompact(minor, "RUB"))).toBe(expected);
  });
});
