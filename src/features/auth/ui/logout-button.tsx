import { IconLogout } from "@/shared/ui/icons";
import { SubmitButton } from "@/shared/ui/submit-button";
import { logout } from "../api/actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      {/* На узких экранах — только иконка, чтобы рядом поместилось имя пользователя. */}
      <SubmitButton variant="ghost" size="sm" aria-label="Выйти" title="Выйти">
        <IconLogout className="size-4" />
        <span className="hidden sm:inline">Выйти</span>
      </SubmitButton>
    </form>
  );
}
