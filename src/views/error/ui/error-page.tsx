"use client";

import Link from "next/link";
import { useEffect } from "react";
import { routes } from "@/shared/config";
import { Button, buttonClassName } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { IconAlert } from "@/shared/ui/icons";
import { AppHeader } from "@/widgets/app-header";

interface ErrorPageProps {
  error: unknown;
  /** Повторно загрузить и отрисовать сегмент (проп retry из error.tsx). */
  retry: () => void;
  /** standalone — своя шапка (ошибка вне лейаутов), cabinet — внутри меню кабинета. */
  layout: "standalone" | "cabinet";
}

function getDigest(error: unknown): string | undefined {
  if (error instanceof Error && "digest" in error && typeof error.digest === "string") {
    return error.digest;
  }
  return undefined;
}

/** Страница ошибки: понятный текст, повтор и код для поиска в логах сервера. */
export function ErrorPage({ error, retry, layout }: ErrorPageProps) {
  const digest = getDigest(error);

  useEffect(() => {
    console.error(error);
  }, [error]);

  const content = (
    <EmptyState
      icon={<IconAlert />}
      title="Что-то пошло не так"
      description="Не удалось загрузить страницу. Попробуйте ещё раз — обычно это временный сбой."
      action={
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={() => retry()}>Попробовать снова</Button>
            <Link href={routes.home} className={buttonClassName({ variant: "secondary" })}>
              На главную
            </Link>
          </div>
          {digest && <p className="text-xs text-muted">Код ошибки: {digest}</p>}
        </div>
      }
    />
  );

  if (layout === "cabinet") {
    return <Card>{content}</Card>;
  }
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader homeHref={routes.home} />
      <main className="flex flex-1 items-center justify-center px-4 py-12">{content}</main>
    </div>
  );
}
