import { IconLogout } from "@/shared/ui/icons";
import { SubmitButton } from "@/shared/ui/submit-button";
import { logout } from "../api/actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <SubmitButton variant="ghost" size="sm">
        <IconLogout className="size-4" />
        Выйти
      </SubmitButton>
    </form>
  );
}
