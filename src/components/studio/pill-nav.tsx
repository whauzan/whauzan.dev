import Link from "next/link";
import type * as React from "react";
import { cn } from "@/lib/utils";

interface PillNavItem {
  href: string;
  label: string;
  /** Marks the current page — amber, and `aria-current="page"`. */
  active?: boolean;
}

interface PillNavProps extends React.ComponentProps<"header"> {
  items: PillNavItem[];
  /** No logo file exists; the mark is the name set in type. */
  name?: string;
}

/**
 * Site chrome as a floating pill. Replaces `TransportBar`: it floats rather
 * than spanning the viewport, and its links are sentence-case sans, since mono
 * at nav size reads as a terminal prompt. Ships no JS — keep it that way.
 */
function PillNav({ items, name = "WHR", className, ...props }: PillNavProps) {
  return (
    <header
      data-slot="pill-nav"
      // `fixed`, not `sticky`: sticky occupies flow space and pushes a
      // min-h-svh hero down, cropping whatever sits at its bottom edge.
      className={cn(
        "fixed inset-x-0 top-4 z-50 flex justify-center px-6",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2 rounded-lg bg-card px-3 py-2 shadow-float sm:gap-4 sm:px-4">
        <Link
          href={items.find((item) => item.active)?.href ?? "/"}
          className="shrink-0 px-1 font-mono text-sm font-bold tracking-label text-foreground"
        >
          {name}
        </Link>

        <nav aria-label="Main">
          <ul className="flex items-center gap-1 sm:gap-2">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-8 items-center rounded-sm px-2 text-sm whitespace-nowrap sm:px-3",
                    "transition-colors duration-(--dur-fast) ease-attack",
                    item.active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export { PillNav };
export type { PillNavItem, PillNavProps };
