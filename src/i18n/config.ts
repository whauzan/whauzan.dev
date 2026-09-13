/** Listing order wherever both appear. The `/id` prefix lives in routing.ts. */
export const locales = ["en", "id"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale = "en" satisfies Locale;

/** Lets `dynamicParams = false` type-check without an `as` cast. */
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
