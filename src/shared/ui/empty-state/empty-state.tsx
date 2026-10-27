import type { ReactNode } from "react";
import { cn } from "@/shared/lib";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4 px-6 py-10 text-center", className)}>
      {icon && (
        <div className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent [&>svg]:size-6">
          {icon}
        </div>
      )}
      <div className="max-w-sm">
        <p className="font-semibold text-ink">{title}</p>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
