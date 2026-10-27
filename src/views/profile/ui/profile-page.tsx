import { requireUser } from "@/entities/session";
import { DisplayCurrencyForm } from "@/features/change-display-currency";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { PageHeader } from "@/shared/ui/page-header";

export async function ProfilePage() {
  const user = await requireUser();
  const fields = [
    { label: "Имя", value: user.name },
    { label: "Email", value: user.email },
  ];

  return (
    <>
      <PageHeader title="Профиль" />
      <div className="grid max-w-xl gap-4">
        <Card title="Аккаунт" actions={<Badge tone="accent">Тестовый</Badge>}>
          <dl className="divide-y divide-line">
            {fields.map((field) => (
              <div key={field.label} className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[8rem_1fr]">
                <dt className="text-sm text-muted">{field.label}</dt>
                <dd className="text-sm break-all text-ink">{field.value}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card title="Валюта" description="В основную валюту пересчитываются итоги на дашборде — по курсу ЦБ РФ.">
          <DisplayCurrencyForm currentCurrency={user.displayCurrency} />
        </Card>
      </div>
    </>
  );
}
