"use client";

import { ErrorPage } from "@/views/error";

// Ошибка в лейаутах групп (например, не удалось проверить сессию в лейауте кабинета).
export default function RootError({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorPage error={error} retry={retry} layout="standalone" />;
}
