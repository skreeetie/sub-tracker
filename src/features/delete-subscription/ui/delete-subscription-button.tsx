"use client";

import { useState, useTransition } from "react";
import { Button } from "@/shared/ui/button";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { IconTrash } from "@/shared/ui/icons";
import { deleteSubscriptionAction } from "../api/delete-subscription";

interface DeleteSubscriptionButtonProps {
  subscriptionId: string;
  subscriptionName: string;
}

/** Кнопка удаления подписки с подтверждением. */
export function DeleteSubscriptionButton({ subscriptionId, subscriptionName }: DeleteSubscriptionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  function close() {
    if (!isPending) {
      setIsOpen(false);
      setError(undefined);
    }
  }

  function confirm() {
    startTransition(async () => {
      try {
        const result = await deleteSubscriptionAction(subscriptionId);
        if (result.error) {
          setError(result.error);
        } else {
          setIsOpen(false);
        }
      } catch {
        // Сбой сети или сервера до ответа action — показываем ошибку в диалоге, а не роняем страницу.
        setError("Не удалось удалить подписку. Попробуйте ещё раз.");
      }
    });
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted hover:text-danger"
        aria-label={`Удалить «${subscriptionName}»`}
        title="Удалить"
        onClick={() => setIsOpen(true)}
      >
        <IconTrash className="size-4" />
      </Button>
      <ConfirmDialog
        open={isOpen}
        onCancel={close}
        onConfirm={confirm}
        title={`Удалить «${subscriptionName}»?`}
        description="Подписка пропадёт из списка и перестанет учитываться в тратах. Отменить удаление нельзя."
        confirmLabel="Удалить"
        tone="danger"
        isPending={isPending}
      >
        {error && (
          <p role="alert" className="mt-2 rounded-control bg-danger-soft px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}
      </ConfirmDialog>
    </>
  );
}
