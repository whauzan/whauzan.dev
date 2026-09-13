import type { Metadata } from "next";
import { defaultLocale, type Locale, locales } from "./config";

/** The one place the `/id` prefix is applied. Never hand-build an href. */
export function localePath(path: string, locale: Locale): string {
  const normalized =
    path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return locale === defaultLocale
    ? normalized || "/"
    : `/${locale}${normalized}`;
}

/**
 * Canonical + hreflang, relative to `metadataBase`. Narrow `available` when a
 * translation is missing, so the page never claims one it does not have.
 */
export function alternates(
  path: string,
  locale: Locale,
  available: readonly Locale[] = locales,
): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const candidate of available) {
    languages[candidate] = localePath(path, candidate);
  }
  languages["x-default"] = localePath(path, defaultLocale);

  const canonicalLocale = available.includes(locale) ? locale : defaultLocale;

  return { canonical: localePath(path, canonicalLocale), languages };
}
