"use client";

import Link from "next/link";
import { useActionState, useState, type FormEvent } from "react";
import {
  billingPeriodLabels,
  billingPeriods,
  categoryLabels,
  subscriptionCategories,
  validateSubscriptionForm,
  type SubscriptionFormErrors,
  type SubscriptionFormField,
} from "@/entities/subscription";
import { routes } from "@/shared/config";
import { buttonClassName } from "@/shared/ui/button";
import { FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { SubmitButton } from "@/shared/ui/submit-button";
import { createSubscriptionAction } from "../api/create-subscription";
import { initialCreateSubscriptionState } from "../model/form-state";

interface CreateSubscriptionFormProps {
  /** Сегодняшняя дата — значение по умолчанию для даты начала. */
  today: string;
}

export function CreateSubscriptionForm({ today }: CreateSubscriptionFormProps) {
  const [state, formAction] = useActionState(createSubscriptionAction, initialCreateSubscriptionState);
  const [clientErrors, setClientErrors] = useState<SubscriptionFormErrors>({});
  const errors: SubscriptionFormErrors = { ...state.errors, ...clientErrors };
  const values = state.values ?? {};

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Та же схема, что и на сервере: при ошибке форма не отправляется.
    const result = validateSubscriptionForm(Object.fromEntries(new FormData(event.currentTarget)));
    if (!result.success) {
      event.preventDefault();
      setClientErrors(result.errors);
    } else {
      setClientErrors({});
    }
  }

  function clearFieldError(field: string) {
    setClientErrors((current) => {
      if (!(field in current)) {
        return current;
      }
      const next = { ...current };
      delete next[field as SubscriptionFormField];
      return next;
    });
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      onChange={(event) => {
        const target = event.target;
        if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
          clearFieldError(target.name);
        }
      }}
      noValidate
      className="grid gap-5"
    >
      {state.formError && (
        <p role="alert" className="rounded-control bg-danger-soft px-4 py-3 text-sm text-danger">
          {state.formError}
        </p>
      )}

      <FormField id="subscription-name" label="Название сервиса" error={errors.name}>
        {(control) => (
          <Input
            {...control}
            name="name"
            defaultValue={values.name}
            placeholder="Например, Музыка"
            autoComplete="off"
          />
        )}
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="subscription-price" label="Стоимость, ₽" error={errors.price}>
          {(control) => (
            <Input {...control} name="price" defaultValue={values.price} inputMode="decimal" placeholder="399" />
          )}
        </FormField>

        <FormField id="subscription-period" label="Период оплаты" error={errors.billingPeriod}>
          {(control) => (
            <Select {...control} name="billingPeriod" defaultValue={values.billingPeriod ?? "monthly"}>
              {billingPeriods.map((period) => (
                <option key={period} value={period}>
                  {billingPeriodLabels[period]}
                </option>
              ))}
            </Select>
          )}
        </FormField>

        <FormField id="subscription-category" label="Категория" error={errors.category}>
          {(control) => (
            <Select {...control} name="category" defaultValue={values.category ?? ""}>
              <option value="" disabled>
                Выберите категорию
              </option>
              {subscriptionCategories.map((category) => (
                <option key={category} value={category}>
                  {categoryLabels[category]}
                </option>
              ))}
            </Select>
          )}
        </FormField>

        <FormField
          id="subscription-start-date"
          label="Дата начала"
          hint="От неё считаются даты списаний"
          error={errors.startDate}
        >
          {(control) => <Input {...control} name="startDate" type="date" defaultValue={values.startDate ?? today} />}
        </FormField>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link href={routes.subscriptions} className={buttonClassName({ variant: "secondary" })}>
          Отмена
        </Link>
        <SubmitButton>Добавить подписку</SubmitButton>
      </div>
    </form>
  );
}
