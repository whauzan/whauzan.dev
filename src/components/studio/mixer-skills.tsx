import type * as React from "react";
import { cn } from "@/lib/utils";

interface MixerChannel {
  label: string;
  /**
   * 0–1. Fader travel is rhythm, not a claim — the number is never rendered
   * and never exposed to assistive tech. There are no skill percentages.
   */
  level: number;
}

interface MixerSkillsProps extends React.ComponentProps<"div"> {
  channels: MixerChannel[];
  /** Fader travel in px. */
  height?: number;
}

const clamp = (n: number) => Math.min(Math.max(n, 0), 1);

/** A rack of vertical faders. Labels carry the meaning; the faders set tempo. */
function MixerSkills({
  channels,
  height = 160,
  className,
  ...props
}: MixerSkillsProps) {
  return (
    <div
      data-slot="mixer-skills"
      className={cn(
        "flex gap-5 overflow-x-auto rounded-md bg-card p-6 hairline",
        className,
      )}
      {...props}
    >
      {channels.map((channel) => {
        const level = clamp(channel.level);
        return (
          <div
            key={channel.label}
            className="flex shrink-0 flex-col items-center gap-3"
          >
            {/* Decorative: the label below is the accessible content. */}
            <div aria-hidden="true" className="relative w-8" style={{ height }}>
              <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border-hi" />
              <span
                className="absolute bottom-0 left-1/2 w-px -translate-x-1/2 bg-primary"
                style={{ height: `${level * 100}%` }}
              />
              {/* Fader cap. */}
              <span
                className="absolute left-1/2 h-1.5 w-7 -translate-x-1/2 translate-y-1/2 rounded-sm bg-panel-hi hairline-hi"
                style={{ bottom: `${level * 100}%` }}
              />
            </div>
            <span className="max-w-16 text-center type-label text-muted-foreground">
              {channel.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export { MixerSkills };
export type { MixerSkillsProps, MixerChannel };
