import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { PageHeader } from "@/shared/ui/page-header";

// Заглушка до этапа 4: данные придут из сессии.
const profile = [
  { label: "Имя", value: "Демо-пользователь" },
  { label: "Email", value: "demo@sub-tracker.local" },
] as const;

export function ProfilePage() {
  return (
    <>
      <PageHeader title="Профиль" />
      <Card title="Аккаунт" actions={<Badge tone="accent">Тестовый</Badge>} className="max-w-xl">
        <dl className="divide-y divide-line">
          {profile.map((item) => (
            <div key={item.label} className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[8rem_1fr]">
              <dt className="text-sm text-muted">{item.label}</dt>
              <dd className="text-sm text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </>
  );
}
