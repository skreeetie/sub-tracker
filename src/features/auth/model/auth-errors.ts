// Коды ошибок сервиса авторизации → сообщения для пользователя.
// Neon Auth отдаёт коды в стиле Supabase (invalid_credentials), Better Auth — в верхнем регистре
// (INVALID_EMAIL_OR_PASSWORD), поэтому сравниваем без учёта регистра и держим оба варианта.
const alreadyRegistered = "Пользователь с таким email уже зарегистрирован";
const notVerified = "Подтвердите email — мы отправили код на почту";
const tooManyRequests = "Слишком много попыток — подождите немного и попробуйте снова";

const messages: Record<string, string> = {
  INVALID_CREDENTIALS: "Неверный email или пароль",
  INVALID_EMAIL_OR_PASSWORD: "Неверный email или пароль",
  INVALID_EMAIL: "Укажите корректный email",
  EMAIL_ADDRESS_INVALID: "Укажите корректный email",
  USER_ALREADY_EXISTS: alreadyRegistered,
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: alreadyRegistered,
  EMAIL_EXISTS: alreadyRegistered,
  PASSWORD_TOO_SHORT: "Пароль слишком короткий",
  PASSWORD_TOO_LONG: "Пароль слишком длинный",
  WEAK_PASSWORD: "Пароль слишком простой — придумайте посложнее",
  EMAIL_NOT_VERIFIED: notVerified,
  EMAIL_NOT_CONFIRMED: notVerified,
  INVALID_OTP: "Неверный код",
  OTP_EXPIRED: "Срок действия кода истёк — запросите новый",
  TOO_MANY_ATTEMPTS: "Слишком много попыток — запросите новый код",
  OVER_REQUEST_RATE_LIMIT: tooManyRequests,
  OVER_EMAIL_SEND_RATE_LIMIT: "Письма отправляются слишком часто — подождите пару минут",
};

function normalize(code: string | undefined): string {
  return (code ?? "").toUpperCase();
}

/** Понятное сообщение по коду ошибки сервиса авторизации; для неизвестных — fallback. */
export function getAuthErrorMessage(code: string | undefined, fallback: string): string {
  return messages[normalize(code)] ?? fallback;
}

export function isEmailNotVerified(code: string | undefined): boolean {
  const normalized = normalize(code);
  return normalized === "EMAIL_NOT_VERIFIED" || normalized === "EMAIL_NOT_CONFIRMED";
}
