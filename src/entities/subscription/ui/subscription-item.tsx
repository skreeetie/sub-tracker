import { formatDateLong, formatMoney, type IsoDate } from "@/shared/lib";
import { Badge } from "@/shared/ui/badge";
import { billingPeriodPriceSuffix, categoryLabels } from "../model/constants";
import type { Subscription } from "../model/subscription";

interface SubscriptionItemProps {
  subscription: Subscription;
  nextBillingDate: IsoDate;
}

export function SubscriptionItem({ subscription, nextBillingDate }: SubscriptionItemProps) {
  return (
    <div className="grid gap-x-4 gap-y-1 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-medium text-ink">{subscription.name}</p>
          <Badge>{categoryLabels[subscription.category]}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted">
          Следующее списание: <time dateTime={nextBillingDate}>{formatDateLong(nextBillingDate)}</time>
        </p>
      </div>
      <p className="text-sm text-ink sm:text-right">
        <span className="font-semibold tabular-nums">{formatMoney(subscription.priceMinor)}</span>{" "}
        <span className="text-muted">{billingPeriodPriceSuffix[subscription.billingPeriod]}</span>
      </p>
    </div>
  );
}
