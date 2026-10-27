"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib";

interface NavLinkProps {
  href: string;
  label: string;
  /** Уже отрендеренная иконка: компонент нельзя передать из серверного компонента в клиентский. */
  icon: ReactNode;
  layout: "row" | "tab";
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({ href, label, icon, layout }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center rounded-control font-medium transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        layout === "row" && "h-10 gap-3 px-3 text-sm",
        layout === "tab" && "h-14 flex-col justify-center gap-1 text-xs",
        isActive ? "text-accent" : "text-muted hover:text-ink",
        isActive && layout === "row" && "bg-accent-soft",
        !isActive && layout === "row" && "hover:bg-surface-muted",
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
