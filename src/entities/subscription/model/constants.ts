import { billingPeriods, currencies, subscriptionCategories } from "@/shared/config";

export { billingPeriods, currencies, subscriptionCategories };

export type BillingPeriod = (typeof billingPeriods)[number];
export type SubscriptionCategory = (typeof subscriptionCategories)[number];

export const billingPeriodLabels: Record<BillingPeriod, string> = {
  monthly: "Ежемесячно",
  yearly: "Ежегодно",
};

/** Для подписи к цене: "399 ₽ в месяц". */
export const billingPeriodPriceSuffix: Record<BillingPeriod, string> = {
  monthly: "в месяц",
  yearly: "в год",
};

export const categoryLabels: Record<SubscriptionCategory, string> = {
  video: "Видео",
  music: "Музыка",
  software: "Софт",
  cloud: "Облако",
  games: "Игры",
  education: "Обучение",
  other: "Другое",
};

export const subscriptionNameMaxLength = 100;
/** 1 000 000 в минимальных единицах любой валюты. */
export const subscriptionPriceMaxMinor = 100_000_000;
