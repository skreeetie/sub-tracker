"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/entities/session";
import { validateSubscriptionForm, type SubscriptionFormField } from "@/entities/subscription";
import { createSubscription } from "@/entities/subscription/index.server";
import { routes } from "@/shared/config";
import type { CreateSubscriptionState } from "../model/form-state";

const fields: SubscriptionFormField[] = ["name", "price", "billingPeriod", "category", "startDate"];

export async function createSubscriptionAction(
  _previousState: CreateSubscriptionState,
  formData: FormData,
): Promise<CreateSubscriptionState> {
  const user = await requireUser();

  const values: Partial<Record<SubscriptionFormField, string>> = {};
  for (const field of fields) {
    const value = formData.get(field);
    if (typeof value === "string") {
      values[field] = value;
    }
  }

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
