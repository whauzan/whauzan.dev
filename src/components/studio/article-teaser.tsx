import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ArticleTeaserProps extends React.ComponentProps<"article"> {
  title: string;
  /** Publication date, already formatted. Rendered as a timecode. */
  date?: string;
  readingTime?: string;
  description?: string;
  tags?: string[];
  href?: string;
  /** Force the arm strip on — for a pinned or featured post. */
  armed?: boolean;
}

/**
 * A writing teaser. Same arm strip as TrackLane, rotated to the top edge —
 * teasers sit in a grid, so a left arm would read as a column rule.
 */
function ArticleTeaser({
  title,
  date,
  readingTime,
  description,
  tags,
  href,
  armed = false,
  className,
  ...props
}: ArticleTeaserProps) {
  return (
    <article
      data-slot="article-teaser"
      data-armed={armed || undefined}
      className={cn(
        "group relative isolate flex h-full flex-col gap-3 overflow-hidden rounded-md bg-card p-5 hairline",
        "transition-[background-color,box-shadow] duration-(--dur-fast) ease-attack",
        "hover:bg-panel-hi hover:hairline-hi focus-within:bg-panel-hi focus-within:hairline-hi",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 h-(--arm-width) origin-left scale-x-0 bg-primary",
          "transition-transform duration-(--dur-fast) ease-attack",
          "group-hover:scale-x-100 group-focus-within:scale-x-100",
          "group-data-armed:scale-x-100",
        )}
      />

      {date || readingTime ? (
        <div className="flex items-center gap-2 type-meta text-tertiary">
          {date ? <span>{date}</span> : null}
          {date && readingTime ? <span aria-hidden="true">·</span> : null}
          {readingTime ? <span>{readingTime}</span> : null}
        </div>
      ) : null}

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

      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}

      {tags?.length ? (
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export { ArticleTeaser };
export type { ArticleTeaserProps };
