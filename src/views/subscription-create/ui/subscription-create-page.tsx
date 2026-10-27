import { requireUser } from "@/entities/session";
import { CreateSubscriptionForm } from "@/features/create-subscription";
import { appTimeZone } from "@/shared/config";
import { getTodayIsoDate } from "@/shared/lib";
import { Card } from "@/shared/ui/card";
import { PageHeader } from "@/shared/ui/page-header";

export async function SubscriptionCreatePage() {
  await requireUser();

  return (
    <>
      <PageHeader title="Новая подписка" description="Цена и дата начала нужны, чтобы считать траты и даты списаний" />
      <Card className="max-w-2xl">
        <CreateSubscriptionForm today={getTodayIsoDate(appTimeZone)} />
      </Card>
    </>
  );
}
