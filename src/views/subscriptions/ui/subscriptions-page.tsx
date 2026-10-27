import { requireUser } from "@/entities/session";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { IconList, IconPlus } from "@/shared/ui/icons";
import { PageHeader } from "@/shared/ui/page-header";

export async function SubscriptionsPage() {
  await requireUser();

  return (
    <>
      <PageHeader
        title="Подписки"
        description="Сервисы, за которые вы платите регулярно"
        actions={
          <Button disabled>
            <IconPlus className="size-4" />
            Добавить подписку
          </Button>
        }
      />
      <Card>
        <EmptyState
          icon={<IconList />}
          title="Подписок пока нет"
          description="Добавьте первую подписку, чтобы видеть траты и даты продления."
        />
      </Card>
    </>
  );
}
