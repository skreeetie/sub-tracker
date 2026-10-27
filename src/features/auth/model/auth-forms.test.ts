import { describe, expect, it } from "vitest";
import { signInSchema, signUpSchema, validateForm, verifyEmailSchema } from "./auth-forms";

describe("signUpSchema", () => {
  it("нормализует имя и email", () => {
    expect(validateForm(signUpSchema, { name: "  Артём ", email: " user@example.com ", password: "12345678" })).toEqual(
      { success: true, data: { name: "Артём", email: "user@example.com", password: "12345678" } },
    );
  });

  it("собирает ошибки по полям", () => {
    expect(validateForm(signUpSchema, { name: "", email: "not-an-email", password: "123" })).toEqual({
      success: false,
      errors: {
        name: "Укажите имя",
        email: "Укажите корректный email",
        password: "Пароль — не короче 8 символов",
      },
    });
  });

  it("сообщает об отсутствующих полях", () => {
    const result = validateForm(signUpSchema, {});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(result.errors).sort()).toEqual(["email", "name", "password"]);
    }
  });
});

describe("signInSchema", () => {
  it("не проверяет длину пароля — только наличие", () => {
    expect(validateForm(signInSchema, { email: "user@example.com", password: "1" }).success).toBe(true);
  });

  it("пустые поля", () => {
    expect(validateForm(signInSchema, { email: "", password: "" })).toEqual({
      success: false,
      errors: { email: "Укажите email", password: "Укажите пароль" },
    });
  });
});

describe("verifyEmailSchema", () => {
  it.each([
    ["123456", true],
    [" 123456 ", true],
    ["12a456", false],
    ["", false],
  ])("код %j → %s", (code, success) => {
    expect(validateForm(verifyEmailSchema, { code }).success).toBe(success);
  });
});
