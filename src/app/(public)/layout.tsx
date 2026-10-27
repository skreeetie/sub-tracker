import Link from "next/link";
import type { ReactNode } from "react";
import { routes } from "@/shared/config";
import { buttonClassName } from "@/shared/ui/button";
import { AppHeader } from "@/widgets/app-header";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader
        homeHref={routes.home}
        actions={
          // Заглушка до этапа 5: вход в демо-аккаунт через features/auth.
          <Link href={routes.dashboard} className={buttonClassName({ size: "sm" })}>
            Войти
          </Link>
        }
      />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
