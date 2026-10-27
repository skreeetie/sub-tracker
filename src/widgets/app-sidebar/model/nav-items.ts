import type { ComponentType } from "react";
import { routes } from "@/shared/config";
import { IconChart, IconList, IconUser, type IconProps } from "@/shared/ui/icons";

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<IconProps>;
}

export const navItems: readonly NavItem[] = [
  { href: routes.dashboard, label: "Дашборд", icon: IconChart },
  { href: routes.subscriptions, label: "Подписки", icon: IconList },
  { href: routes.profile, label: "Профиль", icon: IconUser },
];
