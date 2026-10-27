import Link from "next/link";
import { requireUser } from "@/entities/session";
import { getUserSubscriptions } from "@/entities/subscription/index.server";
import { appTimeZone, routes } from "@/shared/config";
import { getTodayIsoDate } from "@/shared/lib";
import { buttonClassName } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { IconList, IconPlus } from "@/shared/ui/icons";
import { PageHeader } from "@/shared/ui/page-header";
import { SubscriptionList } from "@/widgets/subscription-list";

const addButton = (
  <Link href={routes.newSubscription} className={buttonClassName()}>
    <IconPlus className="size-4" />
    Добавить подписку
  </Link>
);

export async function SubscriptionsPage() {
  const user = await requireUser();
  const subscriptions = await getUserSubscriptions(user.id);

  return (
    <>
      <PageHeader
        title="Подписки"
        description="Сервисы, за которые вы платите регулярно"
        actions={subscriptions.length > 0 ? addButton : undefined}
      />
      {subscriptions.length > 0 ? (
        <SubscriptionList subscriptions={subscriptions} today={getTodayIsoDate(appTimeZone)} />
      ) : (
        <Card>
          <EmptyState
            icon={<IconList />}
            title="Подписок пока нет"
            description="Добавьте первую подписку, чтобы видеть траты и даты продления."
            action={addButton}
          />
        </Card>
      )}
    </>
  );
}
