import { getNextBillingDate, SubscriptionItem, type Subscription } from "@/entities/subscription";
import type { IsoDate } from "@/shared/lib";
import { Card } from "@/shared/ui/card";

interface SubscriptionListProps {
  subscriptions: Subscription[];
  today: IsoDate;
}

/** Список подписок, отсортированный по ближайшему списанию. */
export function SubscriptionList({ subscriptions, today }: SubscriptionListProps) {
  const items = subscriptions
    .map((subscription) => ({
      subscription,
      nextBillingDate: getNextBillingDate(subscription.startDate, subscription.billingPeriod, today),
    }))
    .sort(
      (a, b) =>
        a.nextBillingDate.localeCompare(b.nextBillingDate) ||
        a.subscription.name.localeCompare(b.subscription.name, "ru"),
    );

  return (
    <Card className="py-1">
      <ul className="divide-y divide-line">
        {items.map(({ subscription, nextBillingDate }) => (
          <li key={subscription.id}>
            <SubscriptionItem subscription={subscription} nextBillingDate={nextBillingDate} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
