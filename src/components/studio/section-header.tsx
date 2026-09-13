import type * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps extends React.ComponentProps<"header"> {
  /** Chrome label, e.g. "01 / Selected work". Rendered uppercase mono. */
  label: string;
  title: string;
  description?: string;
  /** Trailing controls — a Button, a Badge, a link. */
  action?: React.ReactNode;
}

/** Section chrome: mono label, sans title, hairline rule underneath. */
function SectionHeader({
  label,
  title,
  description,
  action,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <header
      data-slot="section-header"
      className={cn(
        "flex flex-col gap-4 border-b border-border pb-6",
        className,
      )}
      {...props}
    >
      <span className="type-label text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-heading text-foreground">
          {title}
        </h2>
        {action ? (
          <div className="flex shrink-0 items-center gap-2">{action}</div>
        ) : null}
      </div>
      {description ? (
        <p className="max-w-[60ch] text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
    </header>
  );
}

export { SectionHeader };
export type { SectionHeaderProps };
