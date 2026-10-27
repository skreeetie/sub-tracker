import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/lib";

interface CardProps extends Omit<ComponentProps<"section">, "title"> {
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export function Card({ title, description, actions, className, children, ...props }: CardProps) {
  const hasHeader = Boolean(title || actions);

  return (
    <section className={cn("rounded-card border border-line bg-surface p-5", className)} {...props}>
      {hasHeader && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {title && <h2 className="text-base font-semibold text-ink">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
