"use client";

import { useActionState } from "react";
import { Button } from "@/shared/ui/button";
import { FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";
import { SubmitButton } from "@/shared/ui/submit-button";
import { resendVerificationCodeAction, verifyEmailAction } from "../api/actions";
import type { AuthFormState, VerifyEmailField } from "../model/form-state";
import { FormAlert } from "./form-alert";

const initialState: AuthFormState<VerifyEmailField> = {};

interface VerifyEmailFormProps {
  email: string;
}

export function VerifyEmailForm({ email }: VerifyEmailFormProps) {
  const [state, formAction] = useActionState(verifyEmailAction, initialState);
  const [resendState, resendAction, isResending] = useActionState(resendVerificationCodeAction, initialState);
  const errors = state.errors ?? {};

  return (
    <div className="grid gap-5">
      <p className="text-sm text-muted">
        Мы отправили код подтверждения на <span className="font-medium break-all text-ink">{email}</span>. Код действует
        15 минут.
      </p>
      <form action={formAction} noValidate className="grid gap-5">
        <FormAlert error={state.formError ?? resendState.formError} notice={resendState.notice} />
        <FormField id="verify-email-code" label="Код из письма" error={errors.code}>
          {(control) => (
            <Input
              {...control}
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              defaultValue={state.values?.code}
              className="tracking-[0.3em] tabular-nums"
            />
          )}
        </FormField>
        <SubmitButton className="w-full">Подтвердить</SubmitButton>
      </form>
      <form action={resendAction}>
        <Button type="submit" variant="ghost" size="sm" isLoading={isResending} className="w-full">
          Отправить код ещё раз
        </Button>
      </form>
    </div>
  );
}
