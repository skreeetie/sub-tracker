import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db, subscriptions } from "@/shared/db";
import type { Subscription, SubscriptionInput } from "../model/subscription";

// Каждый запрос фильтруется по user_id: чужую подписку нельзя прочитать или изменить, даже зная id.

const subscriptionColumns = {
  id: subscriptions.id,
  name: subscriptions.name,
  priceMinor: subscriptions.priceMinor,
  currency: subscriptions.currency,
  billingPeriod: subscriptions.billingPeriod,
  category: subscriptions.category,
  startDate: subscriptions.startDate,
};

function byOwner(userId: string, subscriptionId: string) {
  return and(eq(subscriptions.id, subscriptionId), eq(subscriptions.userId, userId));
}

/** Подписки пользователя — только его, по user_id. */
export async function getUserSubscriptions(userId: string): Promise<Subscription[]> {
  return db
    .select(subscriptionColumns)
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt));
}

/** Подписка пользователя по id или null, если её нет или она чужая. */
export async function getUserSubscription(userId: string, subscriptionId: string): Promise<Subscription | null> {
  const [subscription] = await db
    .select(subscriptionColumns)
    .from(subscriptions)
    .where(byOwner(userId, subscriptionId))
    .limit(1);
  return subscription ?? null;
}

export async function createSubscription(userId: string, input: SubscriptionInput): Promise<void> {
  await db.insert(subscriptions).values({ ...input, userId });
}

/** Возвращает false, если подписки нет или она чужая. */
export async function updateSubscription(
  userId: string,
  subscriptionId: string,
  input: SubscriptionInput,
): Promise<boolean> {
  const updated = await db
    .update(subscriptions)
    .set(input)
    .where(byOwner(userId, subscriptionId))
    .returning({ id: subscriptions.id });
  return updated.length > 0;
}

/** Возвращает false, если подписки нет или она чужая. */
export async function deleteSubscription(userId: string, subscriptionId: string): Promise<boolean> {
  const deleted = await db
    .delete(subscriptions)
    .where(byOwner(userId, subscriptionId))
    .returning({ id: subscriptions.id });
  return deleted.length > 0;
}
