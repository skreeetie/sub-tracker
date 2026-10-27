import { billingPeriodPriceSuffix, getUpcomingRenewals, type Subscription } from "@/entities/subscription";
import { formatDateLong, formatDateShort, formatDaysFromNow, formatMoney, type IsoDate } from "@/shared/lib";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { IconCalendar } from "@/shared/ui/icons";

const withinDays = 7;

interface UpcomingRenewalsProps {
  subscriptions: Subscription[];
  today: IsoDate;
}

/** Блок «Скоро продление»: списания в ближайшие 7 дней по дате. */
export function UpcomingRenewals({ subscriptions, today }: UpcomingRenewalsProps) {
  const renewals = getUpcomingRenewals(subscriptions, today, withinDays);
  const totalMinor = renewals.reduce((sum, renewal) => sum + renewal.subscription.priceMinor, 0);

  return (
    <Card title="Скоро продление" description={`Списания в ближайшие ${withinDays} дней`}>
      {renewals.length > 0 ? (
        <>
          <ul className="divide-y divide-line">
            {renewals.map(({ subscription, billingDate, daysUntil }) => (
              <li key={subscription.id} className="flex items-center justify-between gap-3 py-3 first:pt-0">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-ink">{subscription.name}</span>
                  <span className="text-xs text-muted">
                    <time dateTime={billingDate} title={formatDateLong(billingDate)}>
                      {formatDateShort(billingDate)}
                    </time>
                    {" · "}
                    {billingPeriodPriceSuffix[subscription.billingPeriod]}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-sm font-semibold text-ink tabular-nums">
                    {formatMoney(subscription.priceMinor)}
                  </span>
                  <Badge tone={daysUntil <= 1 ? "warning" : "neutral"}>{formatDaysFromNow(daysUntil)}</Badge>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-1 flex items-baseline justify-between border-t border-line pt-3">
            <span className="text-sm text-muted">Всего спишется</span>
            <span className="font-semibold text-ink tabular-nums">{formatMoney(totalMinor)}</span>
          </div>
        </>
      ) : (
        <EmptyState
          icon={<IconCalendar />}
          title="Ближайших списаний нет"
          description={`В ближайшие ${withinDays} дней ничего не спишется.`}
          className="py-6"
        />
      )}
    </Card>
  );
}
