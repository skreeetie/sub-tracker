import { SubscriptionForm } from "@/entities/subscription";
import { routes } from "@/shared/config";
import type { IsoDate } from "@/shared/lib";
import { createSubscriptionAction } from "../api/create-subscription";

interface CreateSubscriptionFormProps {
  /** Сегодняшняя дата — значение по умолчанию для даты начала. */
  today: IsoDate;
}

export function CreateSubscriptionForm({ today }: CreateSubscriptionFormProps) {
  return (
    <SubscriptionForm
      action={createSubscriptionAction}
      defaultValues={{ billingPeriod: "monthly", startDate: today }}
      submitLabel="Добавить подписку"
      cancelHref={routes.subscriptions}
    />
  );
}
