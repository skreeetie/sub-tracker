import { describe, expect, it } from "vitest";
import { formatMoney, parseMoneyToMinor } from "./money";

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
    expect(normalizeSpaces(formatMoney(39900))).toBe("399 ₽");
  });

  it("с копейками — два знака", () => {
    expect(normalizeSpaces(formatMoney(39990))).toBe("399,90 ₽");
  });

  it("разделяет тысячи", () => {
    expect(normalizeSpaces(formatMoney(599000))).toBe("5 990 ₽");
  });
});
