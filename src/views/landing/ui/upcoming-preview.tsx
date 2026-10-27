import { Badge } from "@/shared/ui/badge";

// Пример данных для иллюстрации на стартовой странице.
const charges = [
  { date: "29 окт", name: "Онлайн-кинотеатр", period: "в месяц", price: "399 ₽", soon: "через 2 дня" },
  { date: "2 ноя", name: "Музыка", period: "в месяц", price: "199 ₽" },
  { date: "15 ноя", name: "Облако 200 ГБ", period: "в месяц", price: "149 ₽" },
  { date: "3 дек", name: "Курсы английского", period: "в год", price: "5 990 ₽" },
] as const;

export function UpcomingPreview() {
  return (
    <figure className="rounded-card border border-line bg-surface p-5 shadow-[0_24px_48px_-24px_rgb(22_26_51/0.25)] sm:p-6">
      <figcaption className="mb-4 flex items-baseline justify-between gap-4">
        <span className="font-semibold">Ближайшие списания</span>
        <span className="text-sm text-muted">пример</span>
      </figcaption>
      <ul className="divide-y divide-line">
        {charges.map((charge) => (
          <li key={charge.name} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 py-3">
            <span className="text-sm text-muted tabular-nums">{charge.date}</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{charge.name}</span>
              <span className="text-xs text-muted">{charge.period}</span>
            </span>
            <span className="flex flex-col items-end gap-1">
              <span className="text-sm font-semibold tabular-nums">{charge.price}</span>
              {"soon" in charge && <Badge tone="warning">{charge.soon}</Badge>}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
        <span className="text-sm text-muted">В месяц выходит</span>
        <span className="font-display text-xl font-semibold tabular-nums">1 246 ₽</span>
      </div>
    </figure>
  );
}
