import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/shared/ui/logo";

interface AppHeaderProps {
  /** Куда ведёт логотип. */
  homeHref: string;
  /** Правая часть шапки: пользователь, кнопки входа/выхода. */
  actions?: ReactNode;
}

export function AppHeader({ homeHref, actions }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href={homeHref}
          aria-label="Sub Tracker, на главную"
          className="rounded-control focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <Logo />
        </Link>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </header>
  );
}
