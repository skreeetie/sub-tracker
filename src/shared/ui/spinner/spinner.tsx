import { cn } from "@/shared/lib";

const sizeClassNames = {
  sm: "size-4",
  md: "size-5",
  lg: "size-8",
} as const;

interface SpinnerProps {
  size?: keyof typeof sizeClassNames;
  /** Текст для скринридеров. Без него спиннер декоративный. */
  label?: string;
  className?: string;
}

export function Spinner({ size = "md", label, className }: SpinnerProps) {
  return (
    <span role={label ? "status" : undefined} className={cn("inline-flex", className)}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={cn(
          "animate-spin motion-reduce:animate-[spin_1.5s_linear_infinite]",
          sizeClassNames[size],
        )}
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
