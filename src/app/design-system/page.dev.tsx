import type { Metadata } from "next";
import { ArticleTeaser } from "@/components/studio/article-teaser";
import { ChannelStrip } from "@/components/studio/channel-strip";
import { MixerSkills } from "@/components/studio/mixer-skills";
import { SectionHeader } from "@/components/studio/section-header";
import { TrackLane } from "@/components/studio/track-lane";
import { TransportBar } from "@/components/studio/transport-bar";
import { Waveform } from "@/components/studio/waveform";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "#primitives", label: "Primitives" },
  { href: "#lanes", label: "Lanes" },
  { href: "#writing", label: "Writing" },
  { href: "#mixer", label: "Mixer" },
];

export default function DesignSystemPage() {
  return (
    <>
      <TransportBar items={NAV} />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 py-12 sm:px-6">
        <section className="flex flex-col gap-6">
          <h1 className="text-hero font-semibold tracking-heading text-balance">
            Studio Session
          </h1>
          <p className="max-w-[60ch] text-base text-muted-foreground">
            Every primitive and studio component on one page, so a change to the
            token layer is visible everywhere it lands.
          </p>
          <Waveform bars={64} seed={41} progress={0.62} />
        </section>

        <section id="primitives" className="flex flex-col gap-6">
          <SectionHeader
            label="01 / Primitives"
            title="Buttons, badges, cards"
            description="Four restyled shadcn primitives. Nothing scales, lifts or shifts on hover."
            action={<Badge variant="signal">Live</Badge>}
          />

          <div className="flex flex-wrap items-center gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge>TypeScript</Badge>
            <Badge variant="solid">Solid</Badge>
            <Badge variant="signal">Signal</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Static card</CardTitle>
                <CardDescription>
                  Panel background plus an inset hairline at radius 8.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Elevation is a border and one background step — never an outer
                  shadow.
                </p>
              </CardContent>
            </Card>
            <Card interactive>
              <CardHeader>
                <CardTitle>Interactive card</CardTitle>
                <CardDescription>
                  Hover steps the surface up one level.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Same geometry at rest; only the surface and hairline change.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="lanes" className="flex flex-col gap-6">
          <SectionHeader
            label="02 / Track lanes"
            title="Selected work"
            description="Horizontal from lg up, stacked into a card below it. The arm strip fires on hover and focus-within."
          />
          <div className="flex flex-col gap-3">
            <TrackLane
              armed
              index="01"
              title="Ledgerline"
              subtitle="Staff Engineer · Payments platform"
              time="2023 — NOW"
              tags={["TypeScript", "Next.js", "Postgres"]}
              description="Rebuilt the settlement pipeline around an append-only ledger, cutting reconciliation from hours to minutes."
              href="#lanes"
            />
            <TrackLane
              index="02"
              title="Waveshaper"
              subtitle="Frontend Lead · Audio tooling"
              time="2021 — 2023"
              tags={["React", "WebAudio", "Rust"]}
              description="Browser-native editor with sample-accurate scrubbing over multi-hour sessions."
              href="#lanes"
            />
            <TrackLane
              index="03"
              title="Field Notes"
              subtitle="Solo project"
              time="2020 — 2021"
              tags={["Svelte", "SQLite"]}
              href="#lanes"
            />
          </div>
        </section>

        <section id="writing" className="flex flex-col gap-6">
          <SectionHeader
            label="03 / Writing"
            title="Recent posts"
            action={
              <Button variant="ghost" size="sm">
                Archive
              </Button>
            }
          />
          <div className="grid gap-4 md:grid-cols-3">
            <ArticleTeaser
              armed
              title="The ledger is the product"
              date="2026.02.14"
              readingTime="8 min"
              description="Why append-only storage changed how the whole team reasoned about money."
              tags={["Architecture"]}
              href="#writing"
            />
            <ArticleTeaser
              title="Scrubbing 40,000 samples a frame"
              date="2025.11.02"
              readingTime="12 min"
              description="Getting a waveform editor to feel instant without dropping to native."
              tags={["Performance", "Audio"]}
              href="#writing"
            />
            <ArticleTeaser
              title="Dark-only, on purpose"
              date="2025.08.19"
              readingTime="5 min"
              description="A design system that refuses a light theme, and what that buys you."
              tags={["Design"]}
              href="#writing"
            />
          </div>
        </section>

        <section id="mixer" className="flex flex-col gap-6">
          <SectionHeader
            label="04 / Mixer"
            title="Stack"
            description="Fader travel is rhythm, not a claim. No percentages are rendered anywhere."
          />
          <MixerSkills
            channels={[
              { label: "TS", level: 0.92 },
              { label: "React", level: 0.88 },
              { label: "Next", level: 0.84 },
              { label: "Node", level: 0.76 },
              { label: "Postgres", level: 0.7 },
              { label: "Rust", level: 0.45 },
              { label: "Go", level: 0.38 },
            ]}
          />
          <div className="flex flex-col gap-2">
            <ChannelStrip label="Build" level={0.95} meta="00:42" />
            <ChannelStrip label="Tests" level={0.8} meta="318 passing" />
            <ChannelStrip label="Deploy" level={0.6} meta="streaming" live />
          </div>
        </section>
      </main>
    </>
  );
}
