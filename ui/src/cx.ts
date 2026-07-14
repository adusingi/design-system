// Tiny classname joiner so the package doesn't need a `clsx`/`cn` dependency.
export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
