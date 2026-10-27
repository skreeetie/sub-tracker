import { z } from "zod";
import type { IsoDate } from "@/shared/lib";
import type { BillingPeriod, SubscriptionCategory } from "./constants";

export interface Subscription {
  id: string;
  name: string;
  /** Цена в копейках. */
  priceMinor: number;
  billingPeriod: BillingPeriod;
  category: SubscriptionCategory;
  startDate: IsoDate;
}

/** Данные для создания/изменения подписки — результат валидации формы. */
export type SubscriptionInput = Omit<Subscription, "id">;

const subscriptionIdSchema = z.uuid();

/** id приходит из URL или от клиента — до запроса в БД проверяем, что это uuid. */
export function isSubscriptionId(value: unknown): value is string {
  return subscriptionIdSchema.safeParse(value).success;
}
