import { requireUser } from "@/entities/session";
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
      <Card title="Аккаунт" actions={<Badge tone="accent">Тестовый</Badge>} className="max-w-xl">
        <dl className="divide-y divide-line">
          {fields.map((field) => (
            <div key={field.label} className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[8rem_1fr]">
              <dt className="text-sm text-muted">{field.label}</dt>
              <dd className="text-sm break-all text-ink">{field.value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </>
  );
}
