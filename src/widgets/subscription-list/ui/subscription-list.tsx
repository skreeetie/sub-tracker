import Link from "next/link";
import { getNextBillingDate, SubscriptionItem, type Subscription } from "@/entities/subscription";
import { DeleteSubscriptionButton } from "@/features/delete-subscription";
import { routes } from "@/shared/config";
import type { IsoDate } from "@/shared/lib";
import { buttonClassName } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { IconPencil } from "@/shared/ui/icons";

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
            <SubscriptionItem
              subscription={subscription}
              nextBillingDate={nextBillingDate}
              actions={
                <>
                  <Link
                    href={routes.editSubscription(subscription.id)}
                    aria-label={`Изменить «${subscription.name}»`}
                    title="Изменить"
                    className={buttonClassName({ variant: "ghost", size: "icon", className: "text-muted" })}
                  >
                    <IconPencil className="size-4" />
                  </Link>
                  <DeleteSubscriptionButton subscriptionId={subscription.id} subscriptionName={subscription.name} />
                </>
              }
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}
