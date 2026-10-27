"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../button";

type SubmitButtonProps = Omit<ComponentProps<typeof Button>, "type" | "isLoading">;

/** Кнопка отправки формы: показывает спиннер, пока выполняется action формы. */
export function SubmitButton(props: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return <Button type="submit" isLoading={pending} {...props} />;
}
