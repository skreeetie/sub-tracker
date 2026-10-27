import { VerifyEmailPanel } from "@/features/auth";
import { AuthCard } from "@/shared/ui/auth-card";

export function VerifyEmailPage() {
  return (
    <AuthCard title="Подтвердите email">
      <VerifyEmailPanel />
    </AuthCard>
  );
}
