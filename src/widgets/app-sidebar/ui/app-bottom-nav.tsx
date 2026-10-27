import { navItems } from "../model/nav-items";
import { NavLink } from "./nav-link";

/** Навигация кабинета для мобильных: таб-бар внизу экрана (до md). */
export function AppBottomNav() {
  return (
    <nav
      aria-label="Основная навигация"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-3">
        {navItems.map(({ href, label, icon: ItemIcon }) => (
          <li key={href}>
            <NavLink
              href={href}
              label={label}
              icon={<ItemIcon className="size-5 shrink-0" />}
              layout="tab"
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
