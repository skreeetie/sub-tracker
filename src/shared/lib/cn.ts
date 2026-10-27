type ClassValue = string | false | null | undefined;

/** Склеивает CSS-классы, пропуская пустые значения: cn("a", isActive && "b") */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
