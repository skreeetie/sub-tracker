/** Общий вид полей ввода (Input, Select). Ошибка подсвечивается через aria-invalid. */
export const controlClassName = [
  "h-10 w-full rounded-control border border-line bg-surface px-3 text-sm text-ink transition-colors",
  "placeholder:text-muted hover:border-muted/50",
  "focus-visible:border-accent focus-visible:outline-3 focus-visible:outline-accent/25",
  "aria-invalid:border-danger aria-invalid:focus-visible:outline-danger/25",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");
