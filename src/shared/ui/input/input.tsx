import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";
import { controlClassName } from "./control-class-name";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlClassName, className)} {...props} />;
}
