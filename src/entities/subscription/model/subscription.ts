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
