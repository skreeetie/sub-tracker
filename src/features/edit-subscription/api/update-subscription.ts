"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/entities/session";
import {
  isSubscriptionId,
  readSubscriptionFormValues,
  validateSubscriptionForm,
  type SubscriptionFormState,
} from "@/entities/subscription";
import { updateSubscription } from "@/entities/subscription/index.server";
import { routes } from "@/shared/config";

/** id подписки привязывается через bind на странице, но приходит от клиента — поэтому проверяется. */
export async function updateSubscriptionAction(
  subscriptionId: string,
  _previousState: SubscriptionFormState,
  formData: FormData,
): Promise<SubscriptionFormState> {
  const user = await requireUser();

  const values = readSubscriptionFormValues(formData);
  const result = validateSubscriptionForm(values);
  if (!result.success) {
    return { errors: result.errors, values };
  }

  let isUpdated: boolean;
  try {
    isUpdated = isSubscriptionId(subscriptionId) && (await updateSubscription(user.id, subscriptionId, result.data));
  } catch (error) {
    console.error("Не удалось изменить подписку:", error instanceof Error ? error.message : error);
    return { formError: "Не удалось сохранить изменения. Попробуйте ещё раз.", values };
  }
  if (!isUpdated) {
    return { formError: "Подписка не найдена — возможно, её уже удалили.", values };
  }

  revalidatePath(routes.subscriptions);
  revalidatePath(routes.dashboard);
  redirect(routes.subscriptions);
}
