import "server-only";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { isLocale, type Locale } from "./config";
import en from "./dictionaries/en.json";
import id from "./dictionaries/id.json";

/**
 * The dictionary shape is whatever English says it is. Typing the map below
 * against it means a key added to `en.json` and forgotten in `id.json` fails
 * `pnpm type-check` rather than rendering an English string on an Indonesian
 * page.
 */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, id };

/**
 * The active locale, read from the `[lang]` root param.
 *
 * Server Components only — `next/root-params` cannot be imported from a Client
 * Component, a Server Action or a Route Handler. Pass the locale as a prop
 * across those boundaries.
 */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  // Unreachable while `dynamicParams = false` holds on the [lang] layout; it is
  // here so the narrowing is proven rather than asserted.
  if (!isLocale(value)) notFound();
  return value;
}

/** UI chrome only. Long-form prose lives in MDX, never in the dictionary. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
