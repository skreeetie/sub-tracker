import { SubscriptionForm, toSubscriptionFormValues, type Subscription } from "@/entities/subscription";
import { routes } from "@/shared/config";
import { updateSubscriptionAction } from "../api/update-subscription";

interface EditSubscriptionFormProps {
  subscription: Subscription;
}

export function EditSubscriptionForm({ subscription }: EditSubscriptionFormProps) {
  return (
    <SubscriptionForm
      action={updateSubscriptionAction.bind(null, subscription.id)}
      defaultValues={toSubscriptionFormValues(subscription)}
      submitLabel="Сохранить"
      cancelHref={routes.subscriptions}
    />
  );
}
