export interface AuthFormState<TField extends string> {
  errors?: Partial<Record<TField, string>>;
  /** Ошибка, не связанная с конкретным полем (например, неверный пароль). */
  formError?: string;
  /** Информационное сообщение (например, «код отправлен»). */
  notice?: string;
  /** Введённые значения, кроме пароля, — чтобы не потерять их после ответа сервера. */
  values?: Partial<Record<TField, string>>;
}

export type SignInField = "email" | "password";
export type SignUpField = "name" | "email" | "password";
export type VerifyEmailField = "code";
