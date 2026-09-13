import type * as React from "react";
import { cn } from "@/lib/utils";
import waveform from "./hero-waveform.levels.json";

/** Sanctioned off-palette hex for unplayed bars (§3.3). */
const UNPLAYED = "#343A44";

const MASK =
  "linear-gradient(to right, transparent, #000 22%, #000 88%, transparent)";

interface BarsProps {
  color: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * One pass of the bar field, rendered twice and stacked — neutral underneath,
 * lit copy clipped to the playhead. Height rides `--bar-h` so the easter egg
 * can later repaint the field by writing variables, with no re-render.
 */
function Bars({ color, className, style }: BarsProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center gap-px md:gap-0.75",
        className,
      )}
      style={style}
    >
      {waveform.levels.map((level, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length positional series
          key={i}
          className="min-w-px flex-1 rounded-[1px]"
          style={{
            ["--bar-h" as string]: `${Math.round(level * 100)}%`,
            height: "var(--bar-h)",
            background: color,
          }}
        />
      ))}
    </div>
  );
}

type HeroWaveformProps = React.ComponentProps<"div">;

/**
 * The hero backdrop: the measured shape of a real track, lit behind the
 * playhead. The bars never move — see §3.4 before changing that.
 *
 * Owns no clock. Reads `--playhead` from an ancestor, which is what keeps it a
 * Server Component; `TrackTransport` sets it from real playback position.
 */
function HeroWaveform({ className, style, ...props }: HeroWaveformProps) {
  return (
    <div
      data-slot="hero-waveform"
      aria-hidden="true"
      className={cn("relative h-full w-full", className)}
      style={{
        maskImage: MASK,
        WebkitMaskImage: MASK,
        ...style,
      }}
      {...props}
    >
      <Bars color={UNPLAYED} style={{ opacity: 0.45 }} />

      <Bars
        color="var(--signal)"
        style={{
          opacity: 0.34,
          clipPath: "inset(0 calc(100% - var(--playhead)) 0 0)",
        }}
      />

      <span className="absolute inset-y-0 w-px bg-primary/40 left-(--playhead)" />
    </div>
  );
}

export { HeroWaveform };
export type { HeroWaveformProps };
