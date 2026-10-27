"use client";

import { useActionState } from "react";
import { currencies, currencyLabels, type Currency } from "@/shared/config";
import { FormField } from "@/shared/ui/form-field";
import { Select } from "@/shared/ui/select";
import { SubmitButton } from "@/shared/ui/submit-button";
import { changeDisplayCurrencyAction, type ChangeDisplayCurrencyState } from "../api/change-display-currency";

const initialState: ChangeDisplayCurrencyState = {};

interface DisplayCurrencyFormProps {
  currentCurrency: Currency;
}

/** Выбор основной валюты: в неё пересчитываются итоги дашборда. */
export function DisplayCurrencyForm({ currentCurrency }: DisplayCurrencyFormProps) {
  const [state, formAction] = useActionState(changeDisplayCurrencyAction, initialState);

  return (
    // key: после сохранения форма пересоздаётся с новой валютой из БД.
    <form key={currentCurrency} action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <FormField id="display-currency" label="Основная валюта" error={state.error} className="flex-1">
        {(control) => (
          <Select {...control} name="currency" defaultValue={currentCurrency}>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency} — {currencyLabels[currency]}
              </option>
            ))}
          </Select>
        )}
      </FormField>
      <SubmitButton variant="secondary">Сохранить</SubmitButton>
      {state.isSaved && (
        <p role="status" className="text-sm text-success sm:self-center">
          Сохранено
        </p>
      )}
    </form>
  );
}
