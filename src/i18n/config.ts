/**
 * The locale set, in the order they should appear anywhere both are listed.
 *
 * English is the default and is served unprefixed; Indonesian lives under
 * `/id`. That mapping is applied in `routing.ts` and nowhere else.
 */
export const locales = ["en", "id"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale = "en" satisfies Locale;

/**
 * Narrows a raw segment value to a `Locale`.
 *
 * The `[lang]` segment sets `dynamicParams = false`, so it can only ever hold a
 * known locale at runtime. This guard is what lets that invariant type-check
 * without an `as` cast.
 */
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
