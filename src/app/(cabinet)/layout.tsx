import type { ReactNode } from "react";
import { requireUser } from "@/entities/session";
import { LogoutButton } from "@/features/auth";
import { routes } from "@/shared/config";
import { AppHeader } from "@/widgets/app-header";
import { AppBottomNav, AppSidebar } from "@/widgets/app-sidebar";

// Лейаут не перерисовывается при переходах между страницами, поэтому
// доступ проверяет ещё и каждая страница кабинета (requireUser в views).
export default async function CabinetLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader
        homeHref={routes.dashboard}
        actions={
          <>
            <span title={user.name} className="max-w-32 truncate text-sm text-muted sm:max-w-60">
              {user.name}
            </span>
            <LogoutButton />
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
