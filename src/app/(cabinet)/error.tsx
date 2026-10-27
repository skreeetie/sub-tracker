"use client";

import { ErrorPage } from "@/views/error";

// Ошибка страницы кабинета: шапка и меню кабинета остаются.
export default function CabinetError({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorPage error={error} retry={retry} layout="cabinet" />;
}
