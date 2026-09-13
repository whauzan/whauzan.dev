"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import type * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SocialLinkProps extends React.ComponentProps<"a"> {
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"];
  /** Account name. The accessible name and the tooltip text. */
  label: string;
  href: string;
  /** Opens in a new tab. False for `mailto:`, which must stay in place. */
  external?: boolean;
}

/**
 * Icon-only account link, named on hover and focus. A granted exception to
 * §3.2 r4 and r10 — see §3.4 before changing it.
 *
 * `aria-label` is the only accessible name: Base UI wires no `role="tooltip"`
 * and no `aria-describedby`, so removing it leaves a link announced as a URL.
 */
function SocialLink({
  icon,
  label,
  href,
  external = false,
  className,
  ...props
}: SocialLinkProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <a
            href={href}
            aria-label={label}
            // rel="me" is what lets the Person JSON-LD `sameAs` resolve to one
            // entity rather than three accounts.
            rel={external ? "me noreferrer" : "me"}
            target={external ? "_blank" : undefined}
            data-slot="social-link"
            className={cn(
              "group relative inline-flex size-8 items-center justify-center rounded-sm",
              "text-tertiary transition-colors duration-(--dur-fast) ease-attack",
              "hover:bg-panel-hi hover:text-primary focus-visible:bg-panel-hi focus-visible:text-primary",
              className,
            )}
            {...props}
          />
        }
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 bottom-0 h-(--arm-width) origin-left scale-x-0 bg-primary",
            "transition-transform duration-(--dur-fast) ease-attack",
            "group-hover:scale-x-100 group-focus-visible:scale-x-100",
          )}
        />
        <HugeiconsIcon icon={icon} className="size-5 shrink-0" />
      </TooltipTrigger>

      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

export { SocialLink };
export type { SocialLinkProps };
