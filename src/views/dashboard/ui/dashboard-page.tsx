import Link from "next/link";
import { requireUser } from "@/entities/session";
import { getUserSubscriptions } from "@/entities/subscription/index.server";
import { appTimeZone, routes } from "@/shared/config";
import { getTodayIsoDate } from "@/shared/lib";
import { buttonClassName } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { IconChart, IconPlus } from "@/shared/ui/icons";
import { PageHeader } from "@/shared/ui/page-header";
import { SpendingByCategory } from "@/widgets/spending-by-category";
import { SpendingByMonth } from "@/widgets/spending-by-month";
import { SpendingSummary } from "@/widgets/spending-summary";
import { UpcomingRenewals } from "@/widgets/upcoming-renewals";

export async function DashboardPage() {
  const user = await requireUser();
  const subscriptions = await getUserSubscriptions(user.id);
  const today = getTodayIsoDate(appTimeZone);

  return (
    <>
      <PageHeader title="Дашборд" description="Сводка по всем вашим подпискам" />
      {subscriptions.length > 0 ? (
        <div className="grid gap-4">
          <SpendingSummary subscriptions={subscriptions} />
          <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <SpendingByMonth subscriptions={subscriptions} today={today} />
            <UpcomingRenewals subscriptions={subscriptions} today={today} />
          </div>
          <SpendingByCategory subscriptions={subscriptions} />
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={<IconChart />}
            title="Пока нечего показать"
            description="Добавьте первую подписку — здесь появятся траты по месяцам и категориям и ближайшие списания."
            action={
              <Link href={routes.newSubscription} className={buttonClassName()}>
                <IconPlus className="size-4" />
                Добавить подписку
              </Link>
            }
          />
        </Card>
      )}
    </>
  );
}
