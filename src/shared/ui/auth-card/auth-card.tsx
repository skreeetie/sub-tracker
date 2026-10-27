import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/** Карточка по центру экрана для страниц входа, регистрации и подтверждения email. */
export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="flex flex-1 items-start justify-center px-4 py-12 sm:items-center">
      <section className="w-full max-w-sm rounded-card border border-line bg-surface p-6 sm:p-8">
        <h1 className="font-display text-xl font-semibold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        <div className="mt-6">{children}</div>
      </section>
    </div>
  );
}
