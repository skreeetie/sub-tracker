"use server";

import { redirect } from "next/navigation";
import { auth } from "@/shared/neon-auth/index.server";
import { routes } from "@/shared/config";
import { getAuthErrorMessage, isEmailNotVerified } from "../model/auth-errors";
import { signInSchema, signUpSchema, validateForm, verifyEmailSchema } from "../model/auth-forms";
import type { AuthFormState, SignInField, SignUpField, VerifyEmailField } from "../model/form-state";
import {
  clearPendingVerificationEmail,
  getPendingVerificationEmail,
  setPendingVerificationEmail,
} from "./pending-verification";

function readString(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

/** Логирует только код и статус ошибки — без email и пароля. */
function logAuthError(context: string, error: { code?: string; status: number }) {
  console.warn(`${context}: ${error.code ?? "без кода"} (${error.status})`);
}

async function sendVerificationCode(email: string) {
  const { error } = await auth.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
  if (error) {
    logAuthError("Код подтверждения не отправлен", error);
  }
  return !error;
}

export async function signInAction(
  _previousState: AuthFormState<SignInField>,
  formData: FormData,
): Promise<AuthFormState<SignInField>> {
  const values = { email: readString(formData, "email") };
  const result = validateForm(signInSchema, { ...values, password: readString(formData, "password") });
  if (!result.success) {
    return { errors: result.errors, values };
  }

  const { email, password } = result.data;
  const { error } = await auth.signIn.email({ email, password });
  if (error) {
    if (isEmailNotVerified(error.code)) {
      await sendVerificationCode(email);
      await setPendingVerificationEmail(email);
      redirect(routes.verifyEmail);
    }
    logAuthError("Вход не выполнен", error);
    return { formError: getAuthErrorMessage(error.code, "Не удалось войти. Попробуйте ещё раз."), values };
  }
  redirect(routes.dashboard);
}

export async function signUpAction(
  _previousState: AuthFormState<SignUpField>,
  formData: FormData,
): Promise<AuthFormState<SignUpField>> {
  const values = { name: readString(formData, "name"), email: readString(formData, "email") };
  const result = validateForm(signUpSchema, { ...values, password: readString(formData, "password") });
  if (!result.success) {
    return { errors: result.errors, values };
  }

  const { data, error } = await auth.signUp.email(result.data);
  if (error) {
    logAuthError("Регистрация не выполнена", error);
    return {
      formError: getAuthErrorMessage(error.code, "Не удалось зарегистрироваться. Попробуйте ещё раз."),
      values,
    };
  }
  // Без подтверждения email сессия не создаётся: Neon Auth отправляет код при регистрации.
  if (data?.token) {
    redirect(routes.dashboard);
  }
  await setPendingVerificationEmail(result.data.email);
  redirect(routes.verifyEmail);
}

export async function verifyEmailAction(
  _previousState: AuthFormState<VerifyEmailField>,
  formData: FormData,
): Promise<AuthFormState<VerifyEmailField>> {
  const email = await getPendingVerificationEmail();
  if (!email) {
    return { formError: "Время на подтверждение истекло. Войдите снова — мы пришлём новый код." };
  }

  const values = { code: readString(formData, "code") };
  const result = validateForm(verifyEmailSchema, values);
  if (!result.success) {
    return { errors: result.errors, values };
  }

  const { data, error } = await auth.emailOtp.verifyEmail({ email, otp: result.data.code });
  if (error) {
    logAuthError("Email не подтверждён", error);
    return { formError: getAuthErrorMessage(error.code, "Не удалось подтвердить email. Попробуйте ещё раз."), values };
  }
  await clearPendingVerificationEmail();
  // Обычно после подтверждения Neon Auth сразу открывает сессию; если нет — просим войти.
  redirect(data?.token ? routes.dashboard : `${routes.signIn}?verified=1`);
}

export async function resendVerificationCodeAction(): Promise<AuthFormState<VerifyEmailField>> {
  const email = await getPendingVerificationEmail();
  if (!email) {
    return { formError: "Время на подтверждение истекло. Войдите снова — мы пришлём новый код." };
  }
  return (await sendVerificationCode(email))
    ? { notice: "Отправили новый код — проверьте почту" }
    : { formError: "Не удалось отправить код. Попробуйте чуть позже." };
}

export async function logout() {
  await auth.signOut();
  redirect(routes.home);
}
