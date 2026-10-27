import { notFound } from "next/navigation";
import { requireUser } from "@/entities/session";
import { isSubscriptionId } from "@/entities/subscription";
import { getUserSubscription } from "@/entities/subscription/index.server";
import { EditSubscriptionForm } from "@/features/edit-subscription";
import { Card } from "@/shared/ui/card";
import { PageHeader } from "@/shared/ui/page-header";

interface SubscriptionEditPageProps {
  params: Promise<{ id: string }>;
}

export async function SubscriptionEditPage({ params }: SubscriptionEditPageProps) {
  const user = await requireUser();
  const { id } = await params;

  // Чужая подписка для пользователя не существует — тот же 404, что и для несуществующей.
  const subscription = isSubscriptionId(id) ? await getUserSubscription(user.id, id) : null;
  if (!subscription) {
    notFound();
  }

  return (
    <>
      <PageHeader title="Редактирование подписки" description={subscription.name} />
      <Card className="max-w-2xl">
        <EditSubscriptionForm subscription={subscription} />
      </Card>
    </>
  );
}
