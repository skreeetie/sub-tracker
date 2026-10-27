import Link from "next/link";
import type { ReactNode } from "react";
import { routes } from "@/shared/config";
import { buttonClassName } from "@/shared/ui/button";
import { IconLogout } from "@/shared/ui/icons";
import { AppHeader } from "@/widgets/app-header";
import { AppBottomNav, AppSidebar } from "@/widgets/app-sidebar";

export default function CabinetLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader
        homeHref={routes.dashboard}
        actions={
          // Заглушка до этапа 4: имя из сессии и выход через features/auth.
          <>
            <span className="hidden text-sm text-muted sm:inline">Демо-пользователь</span>
            <Link href={routes.home} className={buttonClassName({ variant: "ghost", size: "sm" })}>
              <IconLogout className="size-4" />
              Выйти
            </Link>
          </>
        }
      />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 pt-6 pb-24 md:px-6 md:pb-12">
        <AppSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <AppBottomNav />
    </div>
  );
}
