"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/entities/session";
import { isSubscriptionId } from "@/entities/subscription";
import { deleteSubscription } from "@/entities/subscription/index.server";
import { routes } from "@/shared/config";

export interface DeleteSubscriptionResult {
  error?: string;
}

/** Удаляет подписку текущего пользователя. Уже удалённая или чужая подписка — не ошибка: её просто нет в списке. */
export async function deleteSubscriptionAction(subscriptionId: string): Promise<DeleteSubscriptionResult> {
  const user = await requireUser();
  if (!isSubscriptionId(subscriptionId)) {
    return { error: "Подписка не найдена." };
  }

  try {
    await deleteSubscription(user.id, subscriptionId);
  } catch (error) {
    console.error("Не удалось удалить подписку:", error instanceof Error ? error.message : error);
    return { error: "Не удалось удалить подписку. Попробуйте ещё раз." };
  }

  revalidatePath(routes.subscriptions);
  revalidatePath(routes.dashboard);
  return {};
}
