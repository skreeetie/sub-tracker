import type { ComponentProps } from "react";

export type IconProps = ComponentProps<"svg">;

/** Базовая обёртка для иконок: 24×24, обводка currentColor. */
export function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}
