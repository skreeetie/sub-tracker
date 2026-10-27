import Link from "next/link";
import { routes } from "@/shared/config";
import { buttonClassName } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { IconCompass } from "@/shared/ui/icons";
import { AppHeader } from "@/widgets/app-header";

/** 404 для любого адреса вне кабинета: своя шапка, ссылка на главную. */
export function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader homeHref={routes.home} />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <EmptyState
          icon={<IconCompass />}
          title="Страница не найдена"
          description="Возможно, адрес набран с ошибкой или страница была удалена."
          action={
            <Link href={routes.home} className={buttonClassName()}>
              На главную
            </Link>
          }
        />
      </main>
    </div>
  );
}

/** 404 внутри кабинета (например, чужая или удалённая подписка): меню кабинета остаётся на месте. */
export function CabinetNotFoundPage() {
  return (
    <Card>
      <EmptyState
        icon={<IconCompass />}
        title="Ничего не нашлось"
        description="Такой страницы нет, или подписка уже удалена."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Link href={routes.subscriptions} className={buttonClassName()}>
              К подпискам
            </Link>
            <Link href={routes.dashboard} className={buttonClassName({ variant: "secondary" })}>
              На дашборд
            </Link>
          </div>
        }
      />
    </Card>
  );
}
