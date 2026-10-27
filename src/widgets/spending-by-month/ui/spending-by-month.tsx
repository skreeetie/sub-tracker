import { getSpendingByMonth, type Subscription } from "@/entities/subscription";
import type { Currency } from "@/shared/config";
import { formatMoney, formatMonthLong, formatMonthShort, type IsoDate } from "@/shared/lib";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { IconChart } from "@/shared/ui/icons";
import { SpendingByMonthChart, type MonthChartPoint } from "./spending-by-month-chart";

interface SpendingByMonthProps {
  /** Подписки с ценами в валюте currency. */
  subscriptions: Subscription[];
  today: IsoDate;
  currency: Currency;
}

/** График фактических списаний за последние 12 месяцев. */
export function SpendingByMonth({ subscriptions, today, currency }: SpendingByMonthProps) {
  // Подписи считаются на сервере — чтобы не зависеть от локали браузера.
  const data: MonthChartPoint[] = getSpendingByMonth(subscriptions, today).map((item) => ({
    ...item,
    // "нояб." → "нояб": без точки на оси помещается больше подписей.
    label: formatMonthShort(item.month).replace(/\.$/, ""),
    fullLabel: formatMonthLong(item.month),
  }));
  const totalMinor = data.reduce((sum, item) => sum + item.totalMinor, 0);

  return (
    <Card
      title="Траты по месяцам"
      description={
        totalMinor > 0
          ? `Фактические списания за 12 месяцев: ${formatMoney(totalMinor, currency)}`
          : "Фактические списания за последние 12 месяцев"
      }
    >
      {totalMinor > 0 ? (
        <>
          <SpendingByMonthChart data={data} currency={currency} />
          <table className="sr-only">
            <caption>Списания по месяцам</caption>
            <thead>
              <tr>
                <th scope="col">Месяц</th>
                <th scope="col">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.month}>
                  <th scope="row">{item.fullLabel}</th>
                  <td>{formatMoney(item.totalMinor, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <EmptyState
          icon={<IconChart />}
          title="Списаний ещё не было"
          description="График заполнится, когда наступит дата первого списания."
        />
      )}
    </Card>
  );
}
