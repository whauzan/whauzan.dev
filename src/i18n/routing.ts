import type { Metadata } from "next";
import { defaultLocale, type Locale, locales } from "./config";

/**
 * The one place the `/id` prefix is applied. Never hand-build an internal href
 * — if the locale mapping ever changes, this function is the only edit.
 *
 * @param path Locale-less path, leading slash, e.g. `/` or `/blog/some-slug`.
 */
export function localePath(path: string, locale: Locale): string {
  const normalized =
    path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return locale === defaultLocale
    ? normalized || "/"
    : `/${locale}${normalized}`;
}

/**
 * Canonical + hreflang for one page, as relative paths resolved against the
 * root layout's `metadataBase`.
 *
 * `available` is how a page tells the truth about what is actually translated:
 * a post with no `id.mdx` still renders in Indonesian off the English body, but
 * it must not claim an `id` alternate, and its canonical points back at the
 * English URL so the two do not compete.
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
