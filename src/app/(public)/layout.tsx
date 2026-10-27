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
          <>
            <Link href={routes.signIn} className={buttonClassName({ variant: "ghost", size: "sm" })}>
              Войти
            </Link>
            <Link href={routes.signUp} className={buttonClassName({ size: "sm" })}>
              Регистрация
            </Link>
          </>
        }
      />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
