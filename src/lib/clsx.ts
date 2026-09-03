/** Join class names, dropping anything falsy. One function, no dependency. */
export function clsx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
