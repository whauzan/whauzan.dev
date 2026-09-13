import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TrackLaneProps extends React.ComponentProps<"article"> {
  /** Track number, e.g. "01". Mono, tertiary. */
  index?: string;
  title: string;
  /** Role, client, or company. */
  subtitle?: string;
  /** Timecode or period, e.g. "2023 — NOW". */
  time?: string;
  tags?: string[];
  description?: string;
  /** Stretches a click target over the whole lane. */
  href?: string;
  /** Force the arm strip on — for the current or featured lane. */
  armed?: boolean;
}

/**
 * A lane in the arrangement: horizontal from `lg` up, stacked card below.
 * The 3px arm strip on the left edge replaces hover-lift entirely.
 */
function TrackLane({
  index,
  title,
  subtitle,
  time,
  tags,
  description,
  href,
  armed = false,
  className,
  ...props
}: TrackLaneProps) {
  return (
    <article
      data-slot="track-lane"
      data-armed={armed || undefined}
      className={cn(
        "group relative isolate overflow-hidden rounded-md bg-card hairline",
        "flex flex-col gap-3 p-5",
        "transition-[background-color,box-shadow] duration-(--dur-fast) ease-attack",
        "hover:bg-panel-hi hover:hairline-hi focus-within:bg-panel-hi focus-within:hairline-hi",
        "lg:grid lg:grid-cols-[auto_1fr_auto_auto] lg:items-center lg:gap-x-6 lg:gap-y-2 lg:px-6",
        className,
      )}
      {...props}
    >
      {/* The system signature. Grows from the top edge; no lift, no shadow. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 left-0 w-(--arm-width) origin-top scale-y-0 bg-primary",
          "transition-transform duration-(--dur-fast) ease-attack",
          "group-hover:scale-y-100 group-focus-within:scale-y-100",
          "group-data-[armed]:scale-y-100",
        )}
      />

      {index ? (
        <span className="type-meta text-tertiary lg:self-center">{index}</span>
      ) : null}

      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold tracking-heading text-foreground">
          {href ? (
            <a
              href={href}
              className="after:absolute after:inset-0 after:content-[''] hover:text-primary focus-visible:text-primary"
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>

      {tags?.length ? (
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      ) : null}

      {time ? (
        <span className="type-meta text-tertiary lg:justify-self-end">
          {time}
        </span>
      ) : null}

      {/* Readable at rest — the DAW metaphor never hides information. */}
      {description ? (
        <p className="max-w-[68ch] text-sm text-muted-foreground lg:col-start-2 lg:col-end-[-1]">
          {description}
        </p>
      ) : null}
    </article>
  );
}

export { TrackLane };
export type { TrackLaneProps };
