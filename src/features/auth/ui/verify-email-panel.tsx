import { redirect } from "next/navigation";
import { routes } from "@/shared/config";
import { getPendingVerificationEmail } from "../api/pending-verification";
import { VerifyEmailForm } from "./verify-email-form";

/** Подтверждение email кодом. Без ожидающего подтверждения email — на страницу входа. */
export async function VerifyEmailPanel() {
  const email = await getPendingVerificationEmail();
  if (!email) {
    redirect(routes.signIn);
  }
  return <VerifyEmailForm email={email} />;
}
