import { getSpendingSummary, type Subscription } from "@/entities/subscription";
import { formatMoney } from "@/shared/lib";
import { Card } from "@/shared/ui/card";

interface SpendingSummaryProps {
  subscriptions: Subscription[];
}

/** Сводка: траты в месяц и в год, количество подписок. */
export function SpendingSummary({ subscriptions }: SpendingSummaryProps) {
  const summary = getSpendingSummary(subscriptions);
  const items = [
    { label: "В месяц", value: formatMoney(summary.monthlyMinor) },
    { label: "В год", value: formatMoney(summary.yearlyMinor) },
    { label: "Активных подписок", value: String(summary.activeCount) },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <p className="text-sm text-muted">{item.label}</p>
          <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}
