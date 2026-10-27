import { SubscriptionForm } from "@/entities/subscription";
import { routes, type Currency } from "@/shared/config";
import type { IsoDate } from "@/shared/lib";
import { createSubscriptionAction } from "../api/create-subscription";

interface CreateSubscriptionFormProps {
  /** Сегодняшняя дата — значение по умолчанию для даты начала. */
  today: IsoDate;
  /** Основная валюта пользователя — валюта по умолчанию. */
  defaultCurrency: Currency;
}

export function CreateSubscriptionForm({ today, defaultCurrency }: CreateSubscriptionFormProps) {
  return (
    <SubscriptionForm
      action={createSubscriptionAction}
      defaultValues={{ billingPeriod: "monthly", currency: defaultCurrency, startDate: today }}
      submitLabel="Добавить подписку"
      cancelHref={routes.subscriptions}
    />
  );
}
