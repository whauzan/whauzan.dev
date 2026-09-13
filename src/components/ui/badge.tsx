import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** The stack chip: 22px tall, hairline outline, mono 12 at 0.02em. */
const badgeVariants = cva(
  "inline-flex h-[22px] w-fit shrink-0 items-center whitespace-nowrap rounded-sm px-2 type-meta",
  {
    variants: {
      variant: {
        default: "bg-transparent text-muted-foreground hairline",
        solid: "bg-primary text-primary-foreground",
        /** Live/animated contexts only — teal is the second accent. */
        signal: "bg-transparent text-signal hairline",
        destructive: "bg-transparent text-destructive hairline",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      { className: cn(badgeVariants({ variant }), className) },
      props,
    ),
    render,
    state: { slot: "badge", variant },
  });
}

export { Badge, badgeVariants };
