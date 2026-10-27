import { z } from "zod";

const passwordMinLength = 8;
const passwordMaxLength = 128;
const nameMaxLength = 100;

const email = z
  .string({ error: "Укажите email" })
  .trim()
  .min(1, { error: "Укажите email" })
  .pipe(z.email({ error: "Укажите корректный email" }));

export const signInSchema = z.object({
  email,
  password: z.string({ error: "Укажите пароль" }).min(1, { error: "Укажите пароль" }),
});

export const signUpSchema = z.object({
  name: z
    .string({ error: "Укажите имя" })
    .trim()
    .min(1, { error: "Укажите имя" })
    .max(nameMaxLength, { error: `Не длиннее ${nameMaxLength} символов` }),
  email,
  password: z
    .string({ error: "Придумайте пароль" })
    .min(passwordMinLength, { error: `Пароль — не короче ${passwordMinLength} символов` })
    .max(passwordMaxLength, { error: `Пароль — не длиннее ${passwordMaxLength} символов` }),
});

export const verifyEmailSchema = z.object({
  code: z
    .string({ error: "Введите код из письма" })
    .trim()
    .min(1, { error: "Введите код из письма" })
    .regex(/^\d{4,8}$/, { error: "Код состоит из цифр" }),
});

export type FieldErrors<TSchema extends z.ZodObject> = Partial<Record<keyof z.input<TSchema>, string>>;

export type FormResult<TSchema extends z.ZodObject> =
  | { success: true; data: z.output<TSchema> }
  | { success: false; errors: FieldErrors<TSchema> };

/** Первая ошибка по каждому полю — для показа под полем. */
export function validateForm<TSchema extends z.ZodObject>(schema: TSchema, values: unknown): FormResult<TSchema> {
  const result = schema.safeParse(values);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors: Partial<Record<string, string>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && field in schema.shape) {
      errors[field] ??= issue.message;
    }
  }
  return { success: false, errors: errors as FieldErrors<TSchema> };
}
