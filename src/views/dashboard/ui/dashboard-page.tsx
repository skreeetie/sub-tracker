import { requireUser } from "@/entities/session";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { IconCalendar, IconChart, IconPlus } from "@/shared/ui/icons";
import { PageHeader } from "@/shared/ui/page-header";

const summary = [
  { label: "В месяц", value: "0 ₽" },
  { label: "В год", value: "0 ₽" },
  { label: "Активных подписок", value: "0" },
] as const;

export async function DashboardPage() {
  await requireUser();

  return (
    <>
      <PageHeader title="Дашборд" description="Сводка по всем вашим подпискам" />
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {summary.map((item) => (
            <Card key={item.label}>
              <p className="text-sm text-muted">{item.label}</p>
              <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{item.value}</p>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <Card title="Траты по месяцам" description="Фактические списания за последние 12 месяцев">
            <EmptyState
              icon={<IconChart />}
              title="Пока нечего показать"
              description="График появится, когда вы добавите первую подписку."
              action={
                <Button disabled>
                  <IconPlus className="size-4" />
                  Добавить подписку
                </Button>
              }
            />
          </Card>
          <Card title="Скоро продление" description="Списания в ближайшие 7 дней">
            <EmptyState icon={<IconCalendar />} title="Ближайших списаний нет" />
          </Card>
        </div>
      </div>
    </>
  );
}
