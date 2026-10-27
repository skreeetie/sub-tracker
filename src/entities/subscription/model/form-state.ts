import { formatMoneyInput } from "@/shared/lib";
import type { SubscriptionFormErrors, SubscriptionFormField } from "./form-schema";
import type { Subscription } from "./subscription";

export const subscriptionFormFields: readonly SubscriptionFormField[] = [
  "name",
  "price",
  "billingPeriod",
  "category",
  "startDate",
];

/** Сырые значения полей формы — как их ввёл пользователь. */
export type SubscriptionFormValues = Partial<Record<SubscriptionFormField, string>>;

export interface SubscriptionFormState {
  errors?: SubscriptionFormErrors;
  /** Ошибка, не связанная с конкретным полем (например, сбой БД). */
  formError?: string;
  /** Введённые значения — чтобы не потерять их после ответа сервера. */
  values?: SubscriptionFormValues;
}

/** Server action формы подписки в формате useActionState. */
export type SubscriptionFormAction = (
  previousState: SubscriptionFormState,
  formData: FormData,
) => Promise<SubscriptionFormState>;

export const initialSubscriptionFormState: SubscriptionFormState = {};

/** Достаёт из FormData только поля формы подписки (строками). */
export function readSubscriptionFormValues(formData: FormData): SubscriptionFormValues {
  const values: SubscriptionFormValues = {};
  for (const field of subscriptionFormFields) {
    const value = formData.get(field);
    if (typeof value === "string") {
      values[field] = value;
    }
  }
  return values;
}

/** Значения формы для редактирования существующей подписки. */
export function toSubscriptionFormValues(subscription: Subscription): SubscriptionFormValues {
  return {
    name: subscription.name,
    price: formatMoneyInput(subscription.priceMinor),
    billingPeriod: subscription.billingPeriod,
    category: subscription.category,
    startDate: subscription.startDate,
  };
}
