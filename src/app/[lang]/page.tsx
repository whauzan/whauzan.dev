import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { site } = getDictionary(locale);

  return {
    title: site.title,
    description: site.description,
    alternates: alternates("/", locale),
  };
}

export default async function HomePage() {
  const locale = await getLocale();
  const { site } = getDictionary(locale);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-280 flex-col justify-center gap-4 px-6 py-16">
      <h1 className="text-hero font-semibold tracking-heading text-balance">
        {site.name}
      </h1>
      <p className="max-w-[60ch] text-base text-muted-foreground">
        {site.tagline}
      </p>
    </main>
  );
}
