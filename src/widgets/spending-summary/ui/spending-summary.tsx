import { getSpendingSummary, type Subscription } from "@/entities/subscription";
import type { Currency } from "@/shared/config";
import { formatMoney } from "@/shared/lib";
import { Card } from "@/shared/ui/card";

interface SpendingSummaryProps {
  /** Подписки с ценами в валюте currency. */
  subscriptions: Subscription[];
  currency: Currency;
}

/** Сводка: траты в месяц и в год, количество подписок. */
export function SpendingSummary({ subscriptions, currency }: SpendingSummaryProps) {
  const summary = getSpendingSummary(subscriptions);
  const items = [
    { label: "В месяц", value: formatMoney(summary.monthlyMinor, currency) },
    { label: "В год", value: formatMoney(summary.yearlyMinor, currency) },
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
