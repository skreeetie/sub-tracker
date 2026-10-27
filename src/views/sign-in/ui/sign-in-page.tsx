import { redirect } from "next/navigation";
import { getCurrentUser } from "@/entities/session";
import { SignInForm } from "@/features/auth";
import { routes } from "@/shared/config";
import { AuthCard } from "@/shared/ui/auth-card";

interface SignInPageProps {
  searchParams: Promise<{ verified?: string | string[] }>;
}

export async function SignInPage({ searchParams }: SignInPageProps) {
  if (await getCurrentUser()) {
    redirect(routes.dashboard);
  }
  const { verified } = await searchParams;

  return (
    <AuthCard title="Вход" description="Войдите, чтобы видеть свои подписки и траты">
      <SignInForm notice={verified === "1" ? "Email подтверждён — теперь можно войти" : undefined} />
    </AuthCard>
  );
}
