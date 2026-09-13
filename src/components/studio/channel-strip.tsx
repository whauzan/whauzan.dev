import type * as React from "react";
import { cn } from "@/lib/utils";

interface ChannelStripProps extends React.ComponentProps<"div"> {
  label: string;
  /** 0–1, quantised to `segments`. Never rendered as a number. */
  level?: number;
  segments?: number;
  /** Trailing metadata — a timecode, a count, a status word. */
  meta?: string;
  /** Teal meter plus a signal dot. Live/animated contexts only. */
  live?: boolean;
}

const clamp = (n: number) => Math.min(Math.max(n, 0), 1);

/** One horizontal channel: label, segmented meter, trailing meta. */
function ChannelStrip({
  label,
  level = 0,
  segments = 16,
  meta,
  live = false,
  className,
  ...props
}: ChannelStripProps) {
  const lit = Math.round(clamp(level) * segments);

  return (
    <div
      data-slot="channel-strip"
      className={cn(
        "flex items-center gap-4 rounded-md bg-card px-4 py-3 hairline",
        className,
      )}
      {...props}
    >
      {live ? (
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full bg-signal"
        />
      ) : null}

      <span className="w-28 shrink-0 truncate type-label text-foreground">
        {label}
      </span>

      <div
        aria-hidden="true"
        className="flex min-w-0 flex-1 items-center gap-0.5"
      >
        {Array.from({ length: segments }, (_, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: segments are a fixed-length positional series
            key={i}
            className={cn(
              "h-3 min-w-px flex-1 rounded-[1px]",
              i < lit ? (live ? "bg-signal" : "bg-primary") : "bg-border-hi",
            )}
          />
        ))}
      </div>

      {meta ? (
        <span className="shrink-0 type-meta text-tertiary">{meta}</span>
      ) : null}
    </div>
  );
}

export { ChannelStrip };
export type { ChannelStripProps };
