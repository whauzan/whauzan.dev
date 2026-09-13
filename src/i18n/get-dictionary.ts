import "server-only";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { isLocale, type Locale } from "./config";
import en from "./dictionaries/en.json";
import id from "./dictionaries/id.json";

/** English defines the shape, so a key missing from `id.json` fails tsc. */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, id };

/** Server Components only — pass the locale as a prop across any boundary. */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  // Unreachable while `dynamicParams = false` holds; proves the narrowing.
  if (!isLocale(value)) notFound();
  return value;
}

/** UI chrome only. Long-form prose lives in MDX. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
