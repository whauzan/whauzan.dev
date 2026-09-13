import {
  Github01Icon,
  Mail01Icon,
  TiktokIcon,
} from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import { HeroWaveform } from "@/components/studio/hero-waveform";
import waveform from "@/components/studio/hero-waveform.levels.json";
import { PillNav } from "@/components/studio/pill-nav";
import { SocialLink } from "@/components/studio/social-link";
import { TrackTransport } from "@/components/studio/track-transport";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { alternates, localePath } from "@/i18n/routing";

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
  const { hero, nav, track } = getDictionary(locale);

  const socials = [
    {
      href: "https://github.com/whauzan",
      label: hero.github,
      icon: Github01Icon,
      external: true,
    },
    {
      href: "mailto:wahyuhauzanrafi@gmail.com",
      label: hero.email,
      icon: Mail01Icon,
      external: false,
    },
    {
      href: "https://www.tiktok.com/@whauzan",
      label: hero.tiktok,
      icon: TiktokIcon,
      external: true,
    },
  ];

  return (
    <>
      <PillNav
        items={[
          { href: localePath("/", locale), label: nav.home, active: true },
        ]}
      />

      <main>
        <section className="overflow-hidden">
          <TrackTransport
            className="min-h-svh"
            src="/rue-lumineuse.mp3"
            title={track.title}
            seconds={waveform.seconds}
            playLabel={track.play}
            pauseLabel={track.pause}
          >
            {/* Below lg the field has nowhere to go but behind the copy. */}
            <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 flex w-full items-center opacity-45 lg:w-[64%] lg:opacity-100">
              <HeroWaveform className="h-[38%]" />
            </div>

            <div className="mx-auto flex w-full max-w-280 flex-1 flex-col justify-center gap-6 px-6 pt-20 pb-8 sm:gap-8 sm:pt-28">
              <span className="inline-flex w-fit items-center gap-3 rounded-full bg-card px-4 py-2 type-label text-muted-foreground hairline">
                <span
                  aria-hidden="true"
                  className="size-1.5 animate-pulse rounded-full bg-signal"
                />
                {hero.status}
              </span>

              <h1 className="max-w-[14ch] text-hero font-semibold tracking-heading text-balance">
                {hero.title}
              </h1>

              <p className="max-w-[42ch] text-base text-muted-foreground">
                {hero.positioning}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  nativeButton={false}
                  render={<a href="#projects">{hero.seeWork}</a>}
                />
              </div>

              <TooltipProvider>
                <ul className="-ml-2 flex flex-wrap items-center gap-2">
                  {socials.map((social) => (
                    <li key={social.href}>
                      <SocialLink {...social} />
                    </li>
                  ))}
                </ul>
              </TooltipProvider>
            </div>
          </TrackTransport>
        </section>
      </main>
    </>
  );
}
