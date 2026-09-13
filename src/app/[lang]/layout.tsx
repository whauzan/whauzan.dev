import type { Metadata } from "next";
import { locales } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { inter, jetbrainsMono } from "@/lib/fonts";
import "../globals.css";
import { cn } from "@/lib/utils";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://whauzan.dev";

/** Only `en` and `id` are routes. Anything else in the segment is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

/** Defaults only. Canonical and alternates belong in each page (§5). */
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { site } = getDictionary(locale);

  return {
    metadataBase: new URL(baseUrl),
    title: { default: site.title, template: `%s | ${site.name}` },
    description: site.description,
    openGraph: {
      title: site.title,
      description: site.description,
      siteName: site.name,
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: site.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
      images: ["/og-image.png"],
    },
    icons: { icon: "/favicon.ico" },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={cn("dark", inter.variable, jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
