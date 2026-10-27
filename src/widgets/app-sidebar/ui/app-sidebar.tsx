import { navItems } from "../model/nav-items";
import { NavLink } from "./nav-link";

/** Навигация кабинета для десктопа (от md). */
export function AppSidebar() {
  return (
    <nav aria-label="Основная навигация" className="hidden w-52 shrink-0 md:block">
      <ul className="sticky top-22 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: ItemIcon }) => (
          <li key={href}>
            <NavLink
              href={href}
              label={label}
              icon={<ItemIcon className="size-5 shrink-0" />}
              layout="row"
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
