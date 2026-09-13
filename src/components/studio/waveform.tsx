import type * as React from "react";
import { cn } from "@/lib/utils";

/**
 * xorshift32 — a deterministic PRNG so the server and the client generate the
 * identical bar heights. Math.random() here would be a hydration mismatch.
 */
function levels(count: number, seed: number): number[] {
  let s = seed >>> 0 || 1;
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    const noise = (s % 1000) / 1000;
    // A slow envelope over per-bar noise, so it reads as audio rather than hash.
    const envelope =
      0.35 + 0.65 * Math.abs(Math.sin((i / count) * Math.PI * 3));
    out.push(0.12 + 0.88 * noise * envelope);
  }
  return out;
}

interface WaveformProps extends React.ComponentProps<"div"> {
  bars?: number;
  /** Changing the seed redraws a different — but still stable — waveform. */
  seed?: number;
  /** 0–1. Bars up to here are drawn in the accent; the rest stay hairline. */
  progress?: number;
  /** Teal for live/animated contexts, amber for everything else. */
  variant?: "primary" | "signal";
  /** Opacity breathing. Falls back to fully-lit under reduced motion. */
  animated?: boolean;
}

/** Flat bar chart of a signal. Decorative — never the only copy of a fact. */
function Waveform({
  bars = 48,
  seed = 7,
  progress = 1,
  variant = "primary",
  animated = false,
  className,
  ...props
}: WaveformProps) {
  const heights = levels(bars, seed);
  const played = Math.round(Math.min(Math.max(progress, 0), 1) * bars);

  return (
    <div
      data-slot="waveform"
      aria-hidden="true"
      className={cn("flex h-16 w-full items-center gap-px", className)}
      {...props}
    >
      {heights.map((height, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: bars are a fixed-length positional series
          key={i}
          className={cn(
            "min-w-px flex-1 rounded-[1px]",
            i < played
              ? variant === "signal"
                ? "bg-signal"
                : "bg-primary"
              : "bg-border-hi",
            animated && "animate-pulse",
          )}
          style={{
            height: `${Math.round(height * 100)}%`,
            animationDelay: animated ? `${(i % 12) * 90}ms` : undefined,
          }}
        />
      ))}
    </div>
  );
}

export { Waveform };
export type { WaveformProps };
