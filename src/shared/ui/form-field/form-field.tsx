import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import { FieldError } from "../field-error";
import { Label } from "../label";

/** Пропсы, которые FormField передаёт полю ввода: связывают его с подписью, подсказкой и ошибкой. */
export interface FieldControlProps {
  id: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
}

interface FormFieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: (control: FieldControlProps) => ReactNode;
}

/**
 * Подпись + поле + подсказка + ошибка.
 * @example
 * <FormField id="name" label="Название сервиса" error={errors.name}>
 *   {(control) => <Input {...control} name="name" />}
 * </FormField>
 */
export function FormField({ id, label, hint, error, className, children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })}
      {hint && (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      )}
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}
