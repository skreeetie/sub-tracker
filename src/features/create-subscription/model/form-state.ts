import type { SubscriptionFormErrors, SubscriptionFormField } from "@/entities/subscription";

export interface CreateSubscriptionState {
  errors?: SubscriptionFormErrors;
  /** Ошибка, не связанная с конкретным полем (например, сбой БД). */
  formError?: string;
  /** Введённые значения — чтобы не потерять их после ответа сервера. */
  values?: Partial<Record<SubscriptionFormField, string>>;
}

export const initialCreateSubscriptionState: CreateSubscriptionState = {};
