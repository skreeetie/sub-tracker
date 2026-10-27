import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";
import { IconChevronDown } from "../icons";
import { controlClassName } from "../input";

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select className={cn(controlClassName, "appearance-none pr-9", className)} {...props}>
        {children}
      </select>
      <IconChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
    </div>
  );
}
