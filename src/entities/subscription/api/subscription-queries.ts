import "server-only";
import { desc, eq } from "drizzle-orm";
import { db, subscriptions } from "@/shared/db";
import type { Subscription, SubscriptionInput } from "../model/subscription";

const subscriptionColumns = {
  id: subscriptions.id,
  name: subscriptions.name,
  priceMinor: subscriptions.priceMinor,
  billingPeriod: subscriptions.billingPeriod,
  category: subscriptions.category,
  startDate: subscriptions.startDate,
};

/** Подписки пользователя — только его, по user_id. */
export async function getUserSubscriptions(userId: string): Promise<Subscription[]> {
  return db
    .select(subscriptionColumns)
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt));
}

export async function createSubscription(userId: string, input: SubscriptionInput): Promise<void> {
  await db.insert(subscriptions).values({ ...input, userId });
}
