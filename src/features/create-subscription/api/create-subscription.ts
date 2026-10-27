"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/entities/session";
import {
  readSubscriptionFormValues,
  validateSubscriptionForm,
  type SubscriptionFormState,
} from "@/entities/subscription";
import { createSubscription } from "@/entities/subscription/index.server";
import { routes } from "@/shared/config";

export async function createSubscriptionAction(
  _previousState: SubscriptionFormState,
  formData: FormData,
): Promise<SubscriptionFormState> {
  const user = await requireUser();

  const values = readSubscriptionFormValues(formData);
  const result = validateSubscriptionForm(values);
  if (!result.success) {
    return { errors: result.errors, values };
  }

  try {
    await createSubscription(user.id, result.data);
  } catch (error) {
    console.error("Не удалось создать подписку:", error instanceof Error ? error.message : error);
    return { formError: "Не удалось сохранить подписку. Попробуйте ещё раз.", values };
  }

  revalidatePath(routes.subscriptions);
  revalidatePath(routes.dashboard);
  redirect(routes.subscriptions);
}
