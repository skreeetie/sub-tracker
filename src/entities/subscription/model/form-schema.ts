import { z } from "zod";
import { parseIsoDate, parseMoneyToMinor } from "@/shared/lib";
import {
  billingPeriods,
  subscriptionCategories,
  subscriptionNameMaxLength,
  subscriptionPriceMaxMinor,
} from "./constants";
import type { SubscriptionInput } from "./subscription";

const minStartYear = 2000;
const maxStartYear = 2100;

/** Схема формы подписки: одни и те же правила на клиенте и на сервере. */
export const subscriptionFormSchema = z.object({
  name: z
    .string({ error: "Укажите название сервиса" })
    .trim()
    .min(1, { error: "Укажите название сервиса" })
    .max(subscriptionNameMaxLength, { error: `Не длиннее ${subscriptionNameMaxLength} символов` }),
  price: z
    .string({ error: "Укажите стоимость" })
    .trim()
    .min(1, { error: "Укажите стоимость" })
    .transform((value, ctx) => {
      const minor = parseMoneyToMinor(value);
      if (minor === null) {
        ctx.addIssue({ code: "custom", message: "Введите сумму числом, например 399 или 399,90" });
        return z.NEVER;
      }
      return minor;
    })
    .pipe(
      z
        .number()
        .positive({ error: "Стоимость должна быть больше нуля" })
        .max(subscriptionPriceMaxMinor, { error: "Стоимость не больше 1 000 000 ₽" }),
    ),
  billingPeriod: z.enum(billingPeriods, { error: "Выберите период оплаты" }),
  category: z.enum(subscriptionCategories, { error: "Выберите категорию" }),
  startDate: z
    .string({ error: "Укажите дату начала" })
    .min(1, { error: "Укажите дату начала" })
    .refine(
      (value) => {
        const date = parseIsoDate(value);
        return date !== null && date.year >= minStartYear && date.year <= maxStartYear;
      },
      { error: "Укажите корректную дату начала" },
    ),
});

export type SubscriptionFormField = keyof z.input<typeof subscriptionFormSchema>;
export type SubscriptionFormErrors = Partial<Record<SubscriptionFormField, string>>;

export type SubscriptionFormResult =
  | { success: true; data: SubscriptionInput }
  | { success: false; errors: SubscriptionFormErrors };

/** Проверяет сырые значения формы (например, Object.fromEntries(formData)). */
export function validateSubscriptionForm(values: unknown): SubscriptionFormResult {
  const result = subscriptionFormSchema.safeParse(values);
  if (!result.success) {
    const errors: SubscriptionFormErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && field in subscriptionFormSchema.shape) {
        const key = field as SubscriptionFormField;
        errors[key] ??= issue.message;
      }
    }
    return { success: false, errors };
  }

  const { price, ...rest } = result.data;
  return { success: true, data: { ...rest, priceMinor: price } };
}
