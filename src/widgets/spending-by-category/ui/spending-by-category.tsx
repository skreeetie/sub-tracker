import { categoryLabels, getSpendingByCategory, type Subscription } from "@/entities/subscription";
import { formatMoney } from "@/shared/lib";
import { Card } from "@/shared/ui/card";

interface SpendingByCategoryProps {
  subscriptions: Subscription[];
}

const percentFormat = new Intl.NumberFormat("ru-RU", { style: "percent", maximumFractionDigits: 0 });

/** Распределение месячной нагрузки по категориям: полосы + суммы. */
export function SpendingByCategory({ subscriptions }: SpendingByCategoryProps) {
  const items = getSpendingByCategory(subscriptions);
  const totalMinor = items.reduce((sum, item) => sum + item.monthlyMinor, 0);
  const maxMinor = items[0]?.monthlyMinor ?? 0;

  return (
    <Card title="Траты по категориям" description="Месячная нагрузка, годовые подписки — как цена / 12">
      <ul className="grid gap-4">
        {items.map((item) => {
          const share = totalMinor > 0 ? item.monthlyMinor / totalMinor : 0;
          return (
            <li key={item.category} className="grid gap-1.5">
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="font-medium text-ink">{categoryLabels[item.category]}</span>
                <span className="text-ink tabular-nums">
                  <span className="font-semibold">{formatMoney(item.monthlyMinor)}</span>
                  <span className="ml-2 inline-block w-10 text-right text-muted">{percentFormat.format(share)}</span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-muted" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${maxMinor > 0 ? Math.max((item.monthlyMinor / maxMinor) * 100, 2) : 0}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
