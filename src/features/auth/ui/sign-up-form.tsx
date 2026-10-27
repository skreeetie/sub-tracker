"use client";

import Link from "next/link";
import { useActionState } from "react";
import { routes } from "@/shared/config";
import { FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";
import { SubmitButton } from "@/shared/ui/submit-button";
import { signUpAction } from "../api/actions";
import type { AuthFormState, SignUpField } from "../model/form-state";
import { FormAlert } from "./form-alert";
import { GoogleSignInButton } from "./google-sign-in-button";
import { OrDivider } from "./or-divider";

const initialState: AuthFormState<SignUpField> = {};

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, initialState);
  const errors = state.errors ?? {};

  return (
    <div className="grid gap-5">
      <GoogleSignInButton />
      <OrDivider />
      <form action={formAction} noValidate className="grid gap-5">
        <FormAlert error={state.formError} />
        <FormField id="sign-up-name" label="Имя" error={errors.name}>
          {(control) => <Input {...control} name="name" autoComplete="name" defaultValue={state.values?.name} />}
        </FormField>
        <FormField id="sign-up-email" label="Email" error={errors.email}>
          {(control) => (
            <Input {...control} name="email" type="email" autoComplete="email" defaultValue={state.values?.email} />
          )}
        </FormField>
        <FormField id="sign-up-password" label="Пароль" hint="Не короче 8 символов" error={errors.password}>
          {(control) => <Input {...control} name="password" type="password" autoComplete="new-password" />}
        </FormField>
        <SubmitButton className="w-full">Зарегистрироваться</SubmitButton>
      </form>
      <p className="text-center text-sm text-muted">
        Уже есть аккаунт?{" "}
        <Link href={routes.signIn} className="font-medium text-accent hover:underline">
          Войти
        </Link>
      </p>
    </div>
  );
}
