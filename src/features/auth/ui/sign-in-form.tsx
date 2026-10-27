"use client";

import Link from "next/link";
import { useActionState } from "react";
import { routes } from "@/shared/config";
import { FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";
import { SubmitButton } from "@/shared/ui/submit-button";
import { signInAction } from "../api/actions";
import type { AuthFormState, SignInField } from "../model/form-state";
import { FormAlert } from "./form-alert";
import { GoogleSignInButton } from "./google-sign-in-button";
import { OrDivider } from "./or-divider";

const initialState: AuthFormState<SignInField> = {};

interface SignInFormProps {
  /** Сообщение над формой, например «email подтверждён». */
  notice?: string;
}

export function SignInForm({ notice }: SignInFormProps) {
  const [state, formAction] = useActionState(signInAction, initialState);
  const errors = state.errors ?? {};

  return (
    <div className="grid gap-5">
      <GoogleSignInButton />
      <OrDivider />
      <form action={formAction} noValidate className="grid gap-5">
        <FormAlert error={state.formError} notice={state.formError ? undefined : notice} />
        <FormField id="sign-in-email" label="Email" error={errors.email}>
          {(control) => (
            <Input {...control} name="email" type="email" autoComplete="email" defaultValue={state.values?.email} />
          )}
        </FormField>
        <FormField id="sign-in-password" label="Пароль" error={errors.password}>
          {(control) => <Input {...control} name="password" type="password" autoComplete="current-password" />}
        </FormField>
        <SubmitButton className="w-full">Войти</SubmitButton>
      </form>
      <p className="text-center text-sm text-muted">
        Нет аккаунта?{" "}
        <Link href={routes.signUp} className="font-medium text-accent hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
