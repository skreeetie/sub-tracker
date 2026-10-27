import type { ReactNode } from "react";
import { LoginButton } from "@/features/auth";
import { routes } from "@/shared/config";
import { AppHeader } from "@/widgets/app-header";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader homeHref={routes.home} actions={<LoginButton size="sm" />} />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
