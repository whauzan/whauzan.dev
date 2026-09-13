"use client";

import { PauseIcon, PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TransportItem {
  href: string;
  label: string;
}

interface TransportBarProps extends React.ComponentProps<"header"> {
  items?: TransportItem[];
  /** No logo exists — the mark is the name set in type. */
  name?: string;
}

/**
 * Site chrome as a transport. The play/pause control is the manual motion
 * mute required by the guardrails: it writes `data-motion="paused"` on <html>,
 * which zeroes the duration tokens exactly as the reduced-motion query does.
 */
function TransportBar({
  items = [],
  name = "WHR",
  className,
  ...props
}: TransportBarProps) {
  const [playing, setPlaying] = React.useState(true);

  // The OS preference decides the initial state; the button overrides it.
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
    }
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    if (playing) root.removeAttribute("data-motion");
    else root.setAttribute("data-motion", "paused");
    return () => root.removeAttribute("data-motion");
  }, [playing]);

  return (
    <header
      data-slot="transport-bar"
      className={cn(
        // Flat and opaque — no blur, no gradient.
        "sticky top-0 z-50 flex h-14 items-center gap-6 border-b border-border bg-background px-4 sm:px-6",
        className,
      )}
      {...props}
    >
      <a
        href="/"
        className="shrink-0 font-mono text-sm font-bold tracking-label text-foreground"
      >
        {name}
      </a>

      <nav aria-label="Main" className="min-w-0 flex-1">
        <ul className="flex items-center gap-5 overflow-x-auto">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="type-label whitespace-nowrap text-muted-foreground transition-colors duration-(--dur-fast) ease-attack hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex shrink-0 items-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 rounded-full",
            playing ? "animate-pulse bg-signal" : "bg-tertiary",
          )}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPlaying((p) => !p)}
          aria-pressed={!playing}
          aria-label={playing ? "Pause motion" : "Play motion"}
        >
          <HugeiconsIcon icon={playing ? PauseIcon : PlayIcon} />
        </Button>
      </div>
    </header>
  );
}

export { TransportBar };
export type { TransportBarProps, TransportItem };
