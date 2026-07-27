type ClassValue = string | false | null | undefined;

/** Concatena classes ignorando valores falsos. */
export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}
