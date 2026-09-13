
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# whauzan.dev — agent instructions

Read this fully before your first edit, every session.

This is **whauzan.dev** — a personal portfolio for Wahyu Hauzan Rafi ("Hyu"),
full-stack engineer, frontend-focused, Jakarta. Next.js 16 App Router + React 19
+ Tailwind v4 + shadcn/Base UI, running a design system called **Studio
Session**. No database. Content is MDX on disk. Bilingual: English and Bahasa
Indonesia.

The metaphor is a digital audio workstation: projects are *track lanes*, writing
is *B-sides*, the About panel is a *channel strip*, the skills section is *the
rig*. Use that vocabulary literally and never explain it in the UI.

---

## 0. Orient

### The six rules that override everything

1. **The design system is already decided.** Do not introduce colors, type,
   spacing, radii, shadows or components that are not grounded in it. If a
   request seems to need something new, say so and ask — do not improvise it.
2. **Check §2.1 before you import anything.** Most of what this document
   describes is *planned, not built*. Importing a component that does not exist
   is the single most likely way to waste a session.
3. **Application code lives under `src/`.** `src/app/`, `src/components/`,
   `src/lib/`. Never `app/` or `components/` at the repo root.
4. **Server Components by default.** Content a crawler needs must be in the
   server-rendered HTML. `"use client"` goes on the smallest possible leaf.
5. **No hardcoded user-facing strings.** UI chrome comes from the dictionary
   (§2.3); prose comes from MDX. A literal string in JSX that a visitor can read
   is a bug.
6. **If the user gives you copy, use it verbatim.** Format it; do not rewrite it.

### Commands

```bash
pnpm dev            # next dev
pnpm build          # next build
pnpm lint           # biome check
pnpm format         # biome format --write
pnpm type-check     # tsc --noEmit
```

**pnpm only.** There is a `pnpm-lock.yaml`; npm or yarn will corrupt it.

Git hooks are live: `pre-commit` runs lint-staged, `commit-msg` runs commitlint,
`pre-push` runs `type-check` **and a full `build`**. A broken build blocks the
push, so run `pnpm lint && pnpm type-check` before you claim anything is done.

### Where to look things up

| Question | Source of truth |
|---|---|
| A design token | `src/app/globals.css`. **Only** there. Do not grep elsewhere. |
| What a studio component is for | Its docblock. The docblock is the spec. |
| A Next.js 16 API | `node_modules/next/dist/docs/` — not your training data |
| What is actually built | §2.1 of this file |
| Registry / distribution | `registry.json` |

---

## 1. Product scope

Built in this order. **Do not skip ahead**; each phase assumes the one before it.

| Phase | Scope | Status |
|---|---|---|
| 0 | Token layer, stock components, `/design-system` preview | **done** |
| 1 | i18n skeleton: `[lang]` route tree, dictionaries, rewrites, hreflang | not started |
| 2 | v2 components + the homepage | not started |
| 3 | Content pipeline + `/projects` + `/blog` (index and detail) | not started |
| 4 | SEO/GEO surface: sitemap, robots, JSON-LD, OG images, RSS, llms.txt | not started |
| 5 | Analytics — PostHog | not started |
| — | `/playground`, `/uses`, `/about`, resume PDF | out of scope for now |

**Why i18n comes before the homepage:** retrofitting a locale segment means
moving every route and extracting every string that was written in place. The
route tree and the dictionary loader are cheap to stand up empty and expensive
to add later.

`/playground` is a stated future surface — code snippets and interactive
experiments. Do not build it yet, but do not design anything that makes it
awkward to add.

**The nav must never link to a route that does not exist.** The mockup shows
Home / Blog / Projects / About / Uses; ship only the ones that resolve.

---

## 2. Architecture

### 2.1 What exists, right now

Verify against this before importing. **When you build or delete something,
update this table and `registry.json` in the same commit.** A stale table here
is worse than no table.

**Built**

```
src/app/layout.tsx                    root layout, fonts, base metadata
src/app/globals.css                   THE token layer — all of it
src/app/page.tsx                      placeholder stub, to be replaced
src/app/design-system/page.dev.tsx    dev-only preview of every component
src/components/ui/button.tsx          Base UI + cva
src/components/ui/card.tsx
src/components/ui/badge.tsx
src/components/ui/separator.tsx
src/components/studio/section-header.tsx
src/components/studio/track-lane.tsx
src/components/studio/article-teaser.tsx
src/components/studio/waveform.tsx
src/components/studio/mixer-skills.tsx
src/components/studio/channel-strip.tsx
src/components/studio/transport-bar.tsx
src/lib/utils.ts                      re-exports cn() from the `cn` package
src/lib/fonts.ts                      next/font — Inter + JetBrains Mono
components.json · registry.json · biome.json · commitlint.config.mjs
```

**Not built — do not import these yet**

```
src/components/studio/pill-nav.tsx           src/components/studio/post-row.tsx
src/components/studio/hero-waveform.tsx      src/components/studio/fact-card.tsx
src/components/studio/featured-track.tsx     src/components/studio/sequencer.tsx
src/components/studio/rig-group.tsx          src/components/studio/session-provider.tsx
src/hooks/use-konami.ts
src/app/[lang]/**                            the entire locale route tree
src/i18n/**                                  dictionaries and helpers
src/lib/content/**                           the MDX pipeline
content/**                                   the posts themselves
src/app/sitemap.ts · robots.ts · rss.xml · llms.txt · opengraph-image.tsx
```

The seven screenshots the user supplied are the **target** for the homepage, not
a picture of this repo. Everything labelled "v2 only" in those annotations is
still to be written.

### 2.2 Target directory shape

```
content/                        MDX, git-tracked, no database
  blog/<slug>/en.mdx|id.mdx
  projects/<slug>/en.mdx|id.mdx
public/                         stays at the repo root (Next requirement)
src/
  app/
    [lang]/                     the root layout lives HERE, not above it
      layout.tsx                html lang, fonts, providers
      page.tsx                  homepage
      projects/page.tsx · projects/[slug]/page.tsx
      blog/page.tsx     · blog/[slug]/page.tsx
      design-system/page.dev.tsx  dev-only; must move under [lang] too, see below
    globals.css                 the token layer
    sitemap.ts · robots.ts      metadata files, no layout needed
    llms.txt/route.ts · rss.xml/route.ts   route handlers, no layout needed
  components/
    ui/                         shadcn primitives, restyled to the system
    studio/                     the DAW layer
    seo/                        JSON-LD emitters
  hooks/
  i18n/
    config.ts                   locales, default, type Locale
    dictionaries/en.json · id.json
    get-dictionary.ts           'server-only'
    routing.ts                  localePath(), alternates()
  lib/
    content/                    schema.ts · mdx.ts · blog.ts · projects.ts
    utils.ts · fonts.ts
```

### 2.3 Routing and i18n

**Decided: English is unprefixed, Indonesian is under `/id`.**

```
whauzan.dev/                    → EN home            whauzan.dev/id           → ID home
whauzan.dev/projects            → EN projects        whauzan.dev/id/projects  → ID projects
whauzan.dev/blog/<slug>         → EN post            whauzan.dev/id/blog/<slug>
```

The domain apex is the canonical English page with no redirect hop — that is the
URL recruiters and AI crawlers hit first, and it should resolve in one request.

**Mechanism**

- Every route lives under `src/app/[lang]/`. That segment sits *above* the root
  layout, which makes `lang` a **root param**.
- **This means `src/app/layout.tsx` must be deleted, not kept.** Next requires
  exactly one root layout, and `lang` is only a root param if
  `src/app/[lang]/layout.tsx` *is* that root layout. Move the existing
  `src/app/layout.tsx` and `src/app/design-system/page.tsx` down into `[lang]/`
  as part of Phase 1 — a `page.tsx` left above `[lang]` will have no root layout
  and the build will fail. Only metadata files (`sitemap.ts`, `robots.ts`) and
  route handlers (`route.ts`) may stay above it; they render no UI and need no
  layout.
- `generateStaticParams` in `src/app/[lang]/layout.tsx` returns
  `[{ lang: "en" }, { lang: "id" }]`.
- Read the locale in any Server Component with `import { lang } from
  "next/root-params"` — no prop drilling. It does **not** work in Client
  Components, Server Actions or Route Handlers; pass it as a prop there.
- `next.config.ts` carries a `rewrites` entry mapping unprefixed paths to
  `/en/*`, and a **permanent `redirects` entry from `/en/:path*` to `/:path*`**
  so the same page is never reachable at two URLs.

> **Verify at implementation time.** Redirects run before `beforeFiles`
> rewrites, so the pair should settle in one hop — but confirm `/en/projects`
> 308s to `/projects` and that `/projects` does not loop. If it does, move the
> rewrite into `src/proxy.ts` (Next 16's rename of `middleware.ts`) and keep the
> redirect in config.

**Rules**

- Never build an internal href by hand. Use `localePath(path, locale)` from
  `src/i18n/routing.ts` so the `/id` prefix is applied in exactly one place.
- Every page emits `alternates.languages` with `en`, `id` and `x-default`.
  `x-default` points at the English URL.
- **Never claim a translation that does not exist.** If `id.mdx` is missing for
  a post, the Indonesian route falls back to the English body *and* that page
  omits itself from the `id` hreflang set.
- Dates, numbers and relative times go through `Intl` with the active locale.
  Never a hand-rolled format string.
- The dictionary is for chrome — nav labels, button text, section eyebrows,
  footer links. Long-form prose belongs in MDX, not in a JSON blob.

### 2.4 Content pipeline

MDX files on disk, read at build time, frontmatter validated with **zod**. A
post with a missing or malformed field fails the build rather than shipping a
page with no meta description.

```
content/blog/refactoring-tradingview/en.mdx
content/blog/refactoring-tradingview/id.mdx
```

`src/lib/content/` is the only place that touches `fs`:

| File | Responsibility |
|---|---|
| `schema.ts` | zod schemas for blog and project frontmatter |
| `mdx.ts` | compile MDX (`next-mdx-remote/rsc`) + the shared component map |
| `blog.ts` | `getAllPosts(locale)`, `getPost(slug, locale)`, `getPostSlugs()` |
| `projects.ts` | same shape for projects |

**Blog frontmatter**

```yaml
title:        string, ≤ 60 chars        # also the <title>, so keep it SERP-sized
description:  string, 110–160 chars     # used verbatim as the meta description
publishedAt:  YYYY-MM-DD
updatedAt:    YYYY-MM-DD                # optional
tags:         [string]                  # 1–4, lowercase
cover:        string                    # optional; coverAlt required if present
coverAlt:     string
draft:        boolean                   # default false; excluded from every list
featured:     boolean                   # surfaces on the homepage
```

**Project frontmatter**

```yaml
title · description · year · role · stack: [string]
featured: boolean · order: number
href · repo · cover · coverAlt        # all optional
outcomes: [string]                    # the quotable numbers, one per line
```

**Rules**

- Reading time is **computed**, never authored. One implementation, in `blog.ts`.
- `draft: true` never appears in a list, a sitemap, an RSS feed or `llms.txt`.
- Slug is the directory name. It is the URL; renaming one is a breaking change
  that needs a redirect.
- No `fs` import ever reaches a Client Component. If you need post data in a
  client component, pass it as a serializable prop.
- MDX gets the site's own components (`Badge`, `Callout`, figures) through the
  map in `mdx.ts`. Do not let raw HTML into a post body.

### 2.5 Rendering

- **Every route is statically rendered.** Dynamic routes get
  `generateStaticParams`. There is no user data here and nothing to personalize.
- Content must be present in the initial HTML. Many AI crawlers do not execute
  JavaScript — a fact that only appears after hydration is a fact those crawlers
  will never see. This is a ranking rule, not a preference.
- `params` and `searchParams` are async. Always `await` them.
- Use the generated `PageProps<'/[lang]/blog/[slug]'>` and `LayoutProps<...>`
  helpers rather than hand-written param types.
- `cacheComponents` is **off**. Leave it off until there is a reason; if you turn
  it on, read `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md`
  first and expect to fix blocking routes.

### 2.6 Dev-only routes

A route named **`page.dev.tsx`** exists in development and does not exist in
production. `next.config.ts` puts `dev.ts`/`dev.tsx` in `pageExtensions` only
when `NODE_ENV === "development"` or `SHOW_DEV_ROUTES === "true"`. Without those
extensions the file is not a `page` at all: the directory has no route, nothing
is generated, and nothing the file imports enters the production graph.

This is deliberately stronger than calling `notFound()` inside the page, which
would still emit the route and pull its imports into the build.

`/design-system` is the only such route today.

- **Verified behaviour:** `pnpm dev` serves `/design-system` (200);
  `pnpm build` lists only `/` and `/_not-found`; `SHOW_DEV_ROUTES=true pnpm
  build` lists `/design-system` again, for a preview deployment.
- `pageExtensions` also governs `proxy.ts` and `instrumentation.ts` resolution,
  so **`ts` must stay in the list**. There is no `js`/`jsx` — TypeScript only.
  Adding MDX later means adding `mdx` to *both* branches of the ternary.
- Renaming a route file invalidates `.next`. If a build then fails with
  `TS2307: Cannot find module '.../page.js'` from `.next/dev/types/validator.ts`,
  that is stale generated state — `rm -rf .next tsconfig.tsbuildinfo` and
  rebuild. Nothing is wrong with the code.

---

## 3. The design system — Studio Session

### 3.1 Read before editing

1. This file.
2. `src/app/globals.css` — every token lives here. Nothing is in a config file.
3. The component you are about to change, plus its docblock. Every component in
   `src/components/studio/` has a comment saying what it is for and which rules
   are load-bearing. Those comments are the spec; keep them accurate if you
   change behavior.

### 3.2 Non-negotiables

Each of these has bitten someone. The parenthetical is the failure mode.

1. **Never pure black or pure white.** Canvas is `#0A0B0D`, text is `#E8EAED`.
   (`bg-black`/`text-white` reads as a different site immediately.)
2. **Two accents, one job each.** Amber `--primary` = interactive or identity.
   Teal `--signal` = *this thing is alive* — animating or live only. A static
   decorative element gets neither; it stays neutral. Two on screen at once is
   the ceiling. (Teal on a non-animated element destroys the signal.)
3. **Mono for chrome, sans for reading.** JetBrains Mono for labels, nav,
   buttons, tags, timecodes, metadata, track names — uppercase. Inter for
   anything meant to be read. Body copy in mono is a violation, no exceptions.
4. **Everything readable at rest.** The DAW metaphor never hides information
   behind hover, click or scroll. Hover may *emphasize*; it may never *reveal*.
5. **No skill percentages, ever.** No numbers, bars, or ratings against a skill.
   See `RigGroup` — a chip plus an honest usage note, never a score.
6. **Every animation needs a reduced-motion fallback.** `globals.css` zeroes the
   duration tokens, and the nav's mute button is a manual override — but if you
   drive anything from JS (rAF, setInterval, AudioContext) you must check
   `matchMedia("(prefers-reduced-motion: reduce)")` yourself. Tokens cannot stop
   a timer.
7. **Elevation is border + one background step, not shadow.** Use the `hairline`
   / `hairline-hi` utilities. No outer shadows on cards. No colored left-border
   accents. There is currently **no** float-shadow utility in `globals.css`; if
   the floating `PillNav` needs one, define exactly one (`shadow-float`) in the
   token layer and use it only for genuinely floating overlays.
8. **Nothing scales, lifts or shifts on hover.** Hover lightens: panel steps up,
   border steps up, arm strip lights amber. Press darkens instead.
9. **Flat backgrounds.** No gradients, images, illustration, noise or grain. The
   only texture in the system is the waveform's bar rhythm.
10. **One icon set, on a tight leash. No emoji.** `@hugeicons/react` is the only
    icon source — it is already installed and set in `components.json`. Icons are
    for **functional chrome only**: transport controls, an empty media well, an
    external-link mark, a disclosure chevron. 16px, `currentColor`, never above
    20px, never decorative, never inside body copy, never where a mono label
    would do the job. Do not add a second icon library; if hugeicons lacks what
    you need, flag it and stop.
11. **`·` and the em dash are the only symbols.** `·` separates metadata;
    eyebrows open with an em dash.

### 3.3 Tokens

`src/app/globals.css` maps Studio Session onto shadcn's fixed variable contract
and then adds what shadcn has no slot for. Style against the Tailwind utilities
those generate — `bg-card`, `text-muted-foreground`, `bg-panel-hi`,
`text-signal`, `border-hi`, `text-tertiary` — not raw hex.

**The trap: shadcn's `--accent` is its hover surface, not the brand accent.**
`bg-accent` gives you `#191C22`. Brand amber is `--primary`; brand teal is
`--signal`. This catches everyone once.

Dark-only by design. `:root` and `.dark` carry identical values so a component
branching on `.dark` can never fall through to a light theme. Do not add a light
theme or a theme toggle without asking.

Two custom utilities you should reach for rather than re-implement: `hairline` /
`hairline-hi` (inset 1px border that stays out of layout) and `type-label` /
`type-meta` (the mono chrome combinations, since size + weight + tracking +
transform always travel together).

Radii: 4px controls and tags, 8px cards and panels, 12px outer containers.
Nothing rounder than 12 except circular knobs. Spacing base is 4px, so the 8px
rhythm is every even utility (`gap-2`, `p-4`, `py-6`).

Two off-palette hexes exist on purpose and are fine to reuse: `#0F1114` for empty
media wells, `#343A44` for unplayed hero waveform bars.

### 3.4 Components

Reach for an existing one before writing anything. Two sets.

**Stock** — faithful ports of the design system's own components. Do not restyle
these; if one does not fit, the answer is usually a new `studio/` component.

| Component | Use for | Built |
|---|---|:--:|
| `ui/button` | all CTAs. `default` amber, `ghost` hairline | ✅ |
| `ui/card` | generic panel; `interactive` adds the hover step | ✅ |
| `ui/badge` | the 22px stack chip | ✅ |
| `ui/separator` | 1px rule | ✅ |
| `studio/track-lane` | a dense one-line project row. Horizontal at `lg`+, stacks into a card below — that breakpoint is in the system, not a liberty | ✅ |
| `studio/waveform` | a panel waveform. Bars are `flex-1` with `min-w-px`, so the count sets the density; heights come from a seeded xorshift PRNG so server and client agree | ✅ |
| `studio/mixer-skills` | grouped faders. **Not used on the homepage** — `RigGroup` replaces it | ✅ |
| `studio/channel-strip` | **one horizontal channel row**: label, segmented meter, trailing meta. Note this is a meter row, not the About panel — the homepage's "Channel Strip" *section* is a different thing | ✅ |
| `studio/article-teaser` | a post card. Same arm strip as `TrackLane`, rotated to the top edge, because teasers sit in a grid and a left arm would read as a column rule | ✅ |
| `studio/section-header` | the eyebrow + rule every section opens with | ✅ |
| `studio/transport-bar` | site chrome + the motion mute. **Superseded by `PillNav`** on the site; still the chrome on `/design-system` | ✅ |

**v2** — this site's own, each replacing a stock component for a stated reason.
None of these exist yet. Write the docblock explaining the *why* when you build
each one, and move it to the built column here.

| Component | Replaces | Why | Built |
|---|---|---|:--:|
| `studio/pill-nav` | `TransportBar` | floating centred pill, sentence-case labels | ❌ |
| `studio/hero-waveform` | `Waveform` | masked backdrop, flexing bars, no panel | ❌ |
| `studio/featured-track` | `TrackLane` | full card: ghost numeral, artwork, CTA | ❌ |
| `studio/rig-group` | `MixerSkills` | chips + usage note; a fader reads as a score | ❌ |
| `studio/post-row` | `ArticleTeaser` | index row with excerpt, read time, tags, thumb | ❌ |
| `studio/fact-card` | the meter rail in the About section | three content cards instead of decorative meters | ❌ |
| `studio/sequencer` | — | CH 07, the easter egg | ❌ |
| `studio/session-provider` | — | shared state for the easter egg's page-wide effects | ❌ |

`TrackLane` and `FeaturedTrack` are both meant to ship and both are used:
featured projects get the card, secondary ones get the lane. That is intentional.

**Before adding a component:** can you compose it from these? If not, does it
repeat at least twice? A one-off layout belongs inline in the page. New
components go in `src/components/studio/` with a docblock in the same style, and
get an entry in `registry.json` in the same commit.

The arm strip — 3px, transparent at rest, amber when armed, left edge on lanes
and top edge on teasers — is the system's signature interaction cue and replaces
hover-lift entirely. Do not add it to dense repeating rows (see `PostRow`).

**Component file conventions**, matching what is already in `src/components/`:

- kebab-case filename, one component per file.
- `function Name(props) {}` declaration, never an arrow assigned to a const.
- Named exports at the bottom: `export { Name }; export type { NameProps };`
- Props `interface` extends `React.ComponentProps<"tag">`; spread `...props` onto
  the root element.
- `data-slot="kebab-name"` on the root element.
- `className` merged through `cn()` and always placed last so callers can win.
- Variants through `cva`, not through conditional string concatenation.
- A docblock above the component saying what it is and which rules are
  load-bearing. Props get inline `/** */` comments.

### 3.5 Page structure

Section order on the homepage is fixed; it is the narrative:

```
PillNav              sticky, floating, 16px off the top
01  Hero             status pill, "I'm Hyu", positioning line, 2 CTAs, socials
                     + HeroWaveform behind it
02  Featured Projects  3 × FeaturedTrack, media side alternating
    ALSO IN THIS SESSION  3 × TrackLane
    HIDDEN TRACK · 07     Sequencer, collapsed by default
03  Featured B-sides   3 × PostRow, dashed rules, then a ghost CTA
04  Channel Strip      about prose + 3 × FactCard + 4:5 portrait
05  The Rig            3 × RigGroup — Frontend / Backend / Tooling
Footer               4 columns, then a bottom bar with the live meters
```

Sections are numbered like a tracklist (`— 01 / SESSION`) and About is a channel
(`— CH 01 / ABOUT`). Keep the numbering contiguous if you add one, and ask first.

`/projects` and `/blog` reuse the same vocabulary: a `SectionHeader`, then
`FeaturedTrack` / `PostRow` lists. They are indexes, not new designs — do not
invent a second visual language for them.

Content max-width is 1120px with 24px page padding. Section rhythm is 64px.

---

## 4. Engineering rules

### TypeScript

- `strict` is on. No `any` — use `unknown` and narrow.
- No `as` to silence the compiler, and no `!` without a one-line comment stating
  the invariant that makes it safe.
- `interface` for component props; `type` for unions and utilities.
- Prefer `satisfies` over a type annotation on config objects, so literal types
  survive.
- Export the props type alongside the component.

### React and Next

- **Server Component by default.** Add `"use client"` only when the file needs
  state, an effect, an event handler or a browser API.
- **Push `"use client"` down, not up.** If a section has one interactive control,
  the control is the client component — not the section, not the page.
- A `"use client"` file must not also export data-loading helpers; that drags
  server code into the bundle.
- No `useEffect` to derive state or to fetch content. Effects are for
  subscriptions, DOM APIs and the audio clock.
- `next/link` for every internal navigation. `next/image` for every raster
  image, with explicit dimensions, or `fill` plus a real `sizes`.
- `next/dynamic` for the `Sequencer` — it is the heaviest client component and
  it is below the fold.
- Read the Next 16 docs in `node_modules/next/dist/docs/` before using an API
  you have not used in this repo yet. Several conventions moved in 16
  (`middleware.ts` → `proxy.ts`, root params, cache components).

### Performance

- **Zero layout shift.** Every image and every media well declares an aspect
  ratio. No fixed heights on boxes that hold text.
- No third-party script above the fold. Analytics loads `afterInteractive`.
- Fonts are `next/font` with `display: swap`, already wired. Do not add a third
  family.
- **Do not add a dependency that duplicates something present.** Animation is
  CSS plus `tw-animate-css`. State is React. Class merging is `cn`. Icons are
  hugeicons.
- Any new dependency above roughly 10 kB gzipped needs a sentence in the commit
  body saying what it buys and what was rejected.
- Prefer CSS to JavaScript for anything visual. A transition token beats a
  `useState`.

### Accessibility

- Exactly one `<h1>` per page. Headings never skip a level.
- Interactive things are real `<button>` and `<a>` elements. Never a `div` with
  `onClick`.
- `aria-label` on every icon-only control.
- Focus is visible everywhere: 2px `--ring` at 2px offset, already global. Do not
  remove an outline without replacing it.
- Body-scale text at 4.5:1 against its actual ground. `--muted-foreground`
  (`#8A9099`) passes on canvas; `--foreground-tertiary` (`#5B616B`) does **not** —
  that one is for decorative waveform bars, not type.
- Alt text describes content. A decorative image gets `alt=""`.

### General

- Delete code rather than commenting it out — git remembers.
- A comment explains *why*, never *what*. If the code needs a *what* comment,
  rename something instead.
- No `console.log` in committed code.
- No dead exports, no unused props, no "just in case" abstraction. Two
  occurrences justify a helper; one does not.
- Biome owns formatting and import order. Do not hand-format; run `pnpm format`.

---

## 5. SEO and GEO

This is a portfolio whose job is to be found — both in search results and when
someone asks an AI assistant about Wahyu Hauzan Rafi. Treat both as features,
not as polish.

### Technical SEO

- Every route statically rendered with full content in the HTML (§2.5).
- `generateMetadata` on every page: `title`, `description`,
  `alternates.canonical`, `alternates.languages`, `openGraph`, `twitter`. Never
  ship a page that inherits only the root metadata.
- `src/app/sitemap.ts` — every route × every locale, each entry carrying
  `alternates.languages`, `lastModified` from the post's `updatedAt`.
- `src/app/robots.ts` — allow everything, name the sitemap, and **explicitly
  allow the AI crawlers**: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`,
  `ClaudeBot`, `anthropic-ai`, `PerplexityBot`, `Google-Extended`,
  `Applebot-Extended`, `CCBot`. The default posture on this site is *be
  indexed*.
- `opengraph-image.tsx` at the root and per post, generated with `ImageResponse`
  in the Studio Session palette.
- RSS at `/rss.xml` (and the Indonesian feed), generated from the same loader as
  the blog index so it can never drift.
- `/design-system` stays `noindex` — it already sets this.
- Drafts are excluded from sitemap, RSS and `llms.txt` at the source, not by a
  filter someone might forget.

### Structured data (JSON-LD)

Emit through small server components in `src/components/seo/`, not inline
strings scattered across pages.

- `Person` on the homepage — `name`, `alternateName: "Hyu"`, `jobTitle`,
  `worksFor`, `address` (Jakarta, Indonesia), `alumniOf`, `knowsAbout` (the
  stack), and `sameAs` with GitHub, TikTok and LinkedIn.
- `WebSite` with `inLanguage` and the site name.
- `BlogPosting` on every post: `headline`, `description`, `datePublished`,
  `dateModified`, `inLanguage`, `keywords`, and `author` referencing the Person.
- `CreativeWork` (or `SoftwareSourceCode`) per project.
- `BreadcrumbList` on nested routes.
- **Give the Person node one stable `@id`** (e.g. `https://whauzan.dev/#person`)
  and reference it from every other node. One entity, many mentions — that is
  what makes a knowledge graph resolve to a single person.

### GEO — being citable by AI assistants

- **Content in the HTML, no exceptions.** Most AI crawlers do not run JS.
- **Entity clarity.** One canonical, plain-prose paragraph states who he is:
  full name, role, location, employer, stack, what he is known for. It lives in
  the Channel Strip section and is mirrored in the `Person` JSON-LD
  `description`. Assistants quote extractable declarative facts; give them one
  clean place to find them.
- **Name spelling never varies.** "Wahyu Hauzan Rafi", with "Hyu" as the short
  form. Not "Wahyu H. Rafi", not "hauzan".
- **Sections are self-contained.** Each heading answers one question and does
  not depend on the paragraph before it for context — that is how a retrieval
  chunk survives being read alone.
- **Specific numbers with their context in the same sentence.** "Cut the
  TradingView layer from 7,000 lines to 3,000 and page load by 30%" is quotable;
  "improved performance significantly" is not. This is already the copy rule
  (§6); it is also the single highest-leverage GEO tactic.
- **`/llms.txt`** — a route handler, generated from the content loader so it
  never goes stale: who he is, what the site contains, one line per page.
- Semantic HTML: `<article>`, `<time datetime>`, real heading hierarchy,
  descriptive link text. Never "click here" or "read more" as the whole link.

### Open question to raise, not to decide alone

The mockup's B-sides copy points at `articles.whauzan.dev`. This site plans
`/blog` on the apex, which keeps all domain authority in one place. **Do not
build a subdomain split without asking** — if the user wants the subdomain,
that is a different SEO architecture and needs its own discussion.

---

## 6. Copy

First person, plainspoken, outcome-first. Lead with the verb and the number:
*"Cut the TradingView layer from 7,000 lines to 3,000 and page load by 30%."*
Never "responsible for" or "worked on". **I**, not we — one person's site. Second
person only in CTAs.

Casing carries meaning: uppercase mono is chrome, sentence-case sans is anything
meant to be read. Separator is ` · `. Eyebrows open with an em dash.

Impact lines are one sentence. Nothing runs past three lines. No exclamation
marks.

**Indonesian copy is a translation, not a transliteration.** Keep the same
voice — direct, first person, outcome-first. Technical terms stay in English
(`frontend`, `deploy`, `bundle`); do not invent Indonesian equivalents nobody
uses. The DAW vocabulary stays in English too, since it is the brand.

**If the user gives you copy, use it verbatim.** Format it; do not rewrite it.

---

## 7. The easter egg (CH 07)

Not built yet. When it is:

`Sequencer` is a real 4×8 step sequencer with four synthesized voices. It is not
self-contained — running it also redraws the hero waveform to the pattern, jumps
the footer meters on hits, lights the `PillNav` monogram, flickers the
`FeaturedTrack` ghost numerals on downbeats, and reveals the footer pick.

Those consumers live in different files, so the state sits above them in
`SessionProvider`. `Sequencer` owns the `AudioContext` and calls `report()` each
step; consumers read `useSession()`. Konami (`use-konami`) and clicking the
monogram both open and start it.

If you touch this: keep audio inside `Sequencer` (one `AudioContext` per page),
keep the Konami accent repaint on the provider wrapper rather than `:root` so it
cannot leak into a portal or outlive a route change, and keep the transport
self-muting when `playing` goes false. Timing is `setInterval` on an eighth note,
which is fine at 8 steps and drifts beyond that — move to lookahead scheduling
against `ctx.currentTime` if you extend it.

Do not "simplify" this into a decorative animation. It is deliberate.

---

## 8. Not bugs

- Raw px values and hex literals inside `src/components/studio/` — the design
  system's own sources do the same, and there are no `--ds-space-*` tokens in
  this system. Do not "tokenize" them.
- `--primary` is `#FF5C39`, which is closer to vermilion than to amber. The
  system calls it **amber** everywhere. Keep the name; do not "correct" it.
- `src/lib/utils.ts` is a one-line re-export of the `cn` package rather than the
  usual `clsx` + `tailwind-merge` pair. That is deliberate and smaller.
- Primitives come from `@base-ui/react`, not Radix. `useRender` + `mergeProps` is
  the Base UI polymorphism pattern — it replaces `asChild`.
- No Input, Select, Dialog, Toast, Tooltip or Avatar. The source system defines
  none. `npx shadcn add input` inherits the tokens correctly but carries zero
  Studio Session decisions — check it against §3.2 before shipping it.
- No logo file. Wherever a mark goes, the name is set in type: `WHR` in mono 700
  at 0.04em, or "Wahyu Hauzan Rafi" in Inter 600.
- Fonts come from Google Fonts via `next/font`, not self-hosted. Flagged
  substitution; the licensed files were never supplied.
- `public/` still holds the create-next-app SVGs (`next.svg`, `vercel.svg`,
  `file.svg`, `globe.svg`, `window.svg`). Unused; safe to delete when convenient.
- `README.md` is still the create-next-app boilerplate. Rewrite it when the site
  is real.

---

## 9. Before you call it done

Run `pnpm lint && pnpm type-check`. Then:

**Design**
- Reduced motion: does every new animation stop?
- Accent count: at most two on screen, each doing its assigned job?
- Mono/sans: is any body copy set in mono?
- Contrast: body-scale text at 4.5:1 against its *actual* ground?
- Hover: nothing scales, lifts or shifts?
- Narrow widths: the preview pane can be under 400px. `max-width` not fixed
  `width`, grid tracks that wrap, no fixed heights on boxes holding text.
- Keyboard: focus visible, 2px amber ring at 2px offset.

**Engineering**
- Is this a Server Component? If not, is the `"use client"` boundary as small as
  it can be?
- Any new `useEffect` — is it a subscription/DOM/audio case, or state derivation
  in disguise?
- Any new dependency — is it justified in the commit body?

**Content & i18n**
- Any user-facing string hardcoded in JSX?
- Both `en` and `id` handled, with hreflang telling the truth about what exists?
- Dates formatted through `Intl` with the active locale?

**SEO**
- `generateMetadata` present, with canonical and language alternates?
- New route added to `sitemap.ts` and `llms.txt`?
- Structured data emitted where it applies, referencing the shared Person `@id`?
- Is the new content visible with JavaScript disabled?

**Bookkeeping**
- Did you move anything between the built and not-built columns in §2.1?
- Does `registry.json` list any new component?
- Did you update this file if you changed a rule it states?

---

## 10. Git

Conventional commits, enforced by commitlint on every commit:

```
<type>(<scope>): <Sentence case subject, no trailing period>
```

Types: `feat` `fix` `docs` `style` `refactor` `perf` `test` `chore` `ci` `build`
`revert`. Header ≤ 72 chars, scope lowercase, body lines ≤ 100 chars.

Branch from `main`. Commit or push only when asked. `pre-push` runs a full build,
so a broken build stops the push.
