"use client";

import "./globals.css";
import { ErrorPage } from "@/views/error";

// Ошибка в корневом лейауте: он не отрисовался, поэтому свои <html> и <body>.
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <title>Ошибка — Sub Tracker</title>
        <ErrorPage error={error} retry={retry} layout="standalone" />
      </body>
    </html>
  );
}
