"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/entities/session";
import { updateUserDisplayCurrency } from "@/entities/user/index.server";
import { isCurrency, routes } from "@/shared/config";

export interface ChangeDisplayCurrencyState {
  error?: string;
  /** true — валюта сохранена (для сообщения «Сохранено»). */
  isSaved?: boolean;
}

export async function changeDisplayCurrencyAction(
  _previousState: ChangeDisplayCurrencyState,
  formData: FormData,
): Promise<ChangeDisplayCurrencyState> {
  const user = await requireUser();
  const currency = formData.get("currency");
  if (!isCurrency(currency)) {
    return { error: "Выберите валюту из списка" };
  }

  try {
    await updateUserDisplayCurrency(user.id, currency);
  } catch (error) {
    console.error("Не удалось сохранить основную валюту:", error instanceof Error ? error.message : error);
    return { error: "Не удалось сохранить. Попробуйте ещё раз." };
  }

  revalidatePath(routes.profile);
  revalidatePath(routes.dashboard);
  revalidatePath(routes.newSubscription);
  return { isSaved: true };
}
