import Link from "next/link";
import type { ExchangeRatesSnapshot } from "@/entities/exchange-rate";
import { getExchangeRates } from "@/entities/exchange-rate/index.server";
import { requireUser } from "@/entities/session";
import { getUserSubscriptions } from "@/entities/subscription/index.server";
import { appTimeZone, currencyLabels, routes } from "@/shared/config";
import { formatDateLong, getTodayIsoDate } from "@/shared/lib";
import { buttonClassName } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { IconChart, IconPlus } from "@/shared/ui/icons";
import { PageHeader } from "@/shared/ui/page-header";
import { SpendingByCategory } from "@/widgets/spending-by-category";
import { SpendingByMonth } from "@/widgets/spending-by-month";
import { SpendingSummary } from "@/widgets/spending-summary";
import { UpcomingRenewals } from "@/widgets/upcoming-renewals";
import { convertSubscriptions } from "../model/convert-subscriptions";

const noRates: ExchangeRatesSnapshot = { rates: { RUB: 1 }, ratesDate: null, isStale: false };

export async function DashboardPage() {
  const user = await requireUser();
  const subscriptions = await getUserSubscriptions(user.id);
  const today = getTodayIsoDate(appTimeZone);
  const currency = user.displayCurrency;

  // Курсы нужны, только если есть подписки не в основной валюте.
  const needsRates = subscriptions.some((subscription) => subscription.currency !== currency);
  const exchange = needsRates ? await getExchangeRates() : noRates;
  const { converted, unconverted } = convertSubscriptions(subscriptions, currency, exchange.rates);

  return (
    <>
      <PageHeader
        title="Дашборд"
        description={`Сводка по всем вашим подпискам, итоги в ${currency} (${currencyLabels[currency]})`}
      />
      {subscriptions.length > 0 ? (
        <div className="grid gap-4">
          {needsRates && (
            <RatesNote
              ratesDate={exchange.ratesDate}
              isStale={exchange.isStale}
              unconvertedCount={unconverted.length}
            />
          )}
          <SpendingSummary subscriptions={converted} currency={currency} />
          <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <SpendingByMonth subscriptions={converted} today={today} currency={currency} />
            <UpcomingRenewals subscriptions={subscriptions} today={today} currency={currency} rates={exchange.rates} />
          </div>
          <SpendingByCategory subscriptions={converted} currency={currency} />
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={<IconChart />}
            title="Пока нечего показать"
            description="Добавьте первую подписку — здесь появятся траты по месяцам и категориям и ближайшие списания."
            action={
              <Link href={routes.newSubscription} className={buttonClassName()}>
                <IconPlus className="size-4" />
                Добавить подписку
              </Link>
            }
          />
        </Card>
      )}
    </>
  );
}

interface RatesNoteProps {
  ratesDate: string | null;
  isStale: boolean;
  unconvertedCount: number;
}

/** Откуда взялись курсы и что не удалось пересчитать. */
function RatesNote({ ratesDate, isStale, unconvertedCount }: RatesNoteProps) {
  if (unconvertedCount > 0) {
    return (
      <p role="alert" className="rounded-control bg-warning-soft px-4 py-3 text-sm text-warning">
        Курсы валют сейчас недоступны: подписки в других валютах ({unconvertedCount}) не учтены в итогах.
      </p>
    );
  }
  return (
    <p className="text-sm text-muted">
      Подписки в других валютах пересчитаны по курсу ЦБ РФ
      {ratesDate && <> на {formatDateLong(ratesDate)}</>}
      {isStale && " — сервис курсов не отвечает, взят последний сохранённый курс"}
    </p>
  );
}
