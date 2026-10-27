import { redirect } from "next/navigation";
import { getCurrentUser } from "@/entities/session";
import { SignUpForm } from "@/features/auth";
import { routes } from "@/shared/config";
import { AuthCard } from "@/shared/ui/auth-card";

export async function SignUpPage() {
  if (await getCurrentUser()) {
    redirect(routes.dashboard);
  }

  return (
    <AuthCard title="Регистрация" description="После регистрации подтвердите email кодом из письма">
      <SignUpForm />
    </AuthCard>
  );
}
