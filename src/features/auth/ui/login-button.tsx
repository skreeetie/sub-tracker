import type { ReactNode } from "react";
import type { ButtonSize } from "@/shared/ui/button";
import { SubmitButton } from "@/shared/ui/submit-button";
import { loginAsDemo } from "../api/actions";

interface LoginButtonProps {
  size?: ButtonSize;
  className?: string;
  children?: ReactNode;
}

export function LoginButton({ size, className, children = "Войти" }: LoginButtonProps) {
  return (
    <form action={loginAsDemo}>
      <SubmitButton size={size} className={className}>
        {children}
      </SubmitButton>
    </form>
  );
}
