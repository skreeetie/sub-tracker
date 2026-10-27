import { cn } from "@/shared/lib";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true">
        <rect width="32" height="32" rx="9" className="fill-accent" />
        <path
          d="M23.5 16a7.5 7.5 0 1 1-2.2-5.3"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="stroke-on-accent"
        />
        <path
          d="M22 7.5v3.7h-3.7"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-on-accent"
        />
      </svg>
      <span className="font-display text-base font-semibold tracking-tight text-ink">Sub Tracker</span>
    </span>
  );
}
