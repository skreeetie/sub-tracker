import { describe, expect, it } from "vitest";
import { getAuthErrorMessage, isEmailNotVerified } from "./auth-errors";

describe("getAuthErrorMessage", () => {
  it.each([
    ["invalid_credentials", "Неверный email или пароль"],
    ["INVALID_EMAIL_OR_PASSWORD", "Неверный email или пароль"],
    ["user_already_exists", "Пользователь с таким email уже зарегистрирован"],
    ["USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL", "Пользователь с таким email уже зарегистрирован"],
    ["over_email_send_rate_limit", "Письма отправляются слишком часто — подождите пару минут"],
  ])("код %j → %j", (code, message) => {
    expect(getAuthErrorMessage(code, "Ошибка")).toBe(message);
  });

  it("неизвестный или пустой код — fallback", () => {
    expect(getAuthErrorMessage("network_error", "Не удалось войти")).toBe("Не удалось войти");
    expect(getAuthErrorMessage(undefined, "Не удалось войти")).toBe("Не удалось войти");
  });
});

describe("isEmailNotVerified", () => {
  it.each([
    ["EMAIL_NOT_VERIFIED", true],
    ["email_not_confirmed", true],
    ["invalid_credentials", false],
    [undefined, false],
  ])("%j → %s", (code, expected) => {
    expect(isEmailNotVerified(code)).toBe(expected);
  });
});
