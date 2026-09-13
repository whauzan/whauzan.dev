import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Buttons are chrome: uppercase mono, 0.04em, 4px radius, 36px tall.
 * Hover lightens, press darkens. Nothing scales, lifts or shifts.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-sm type-label transition-[background-color,box-shadow,color] duration-150 ease-attack select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-dim",
        ghost:
          "bg-transparent text-foreground hairline hover:bg-panel-hi hover:hairline-hi active:bg-panel",
        outline:
          "bg-transparent text-foreground hairline hover:bg-panel-hi hover:hairline-hi active:bg-panel",
        secondary:
          "bg-panel text-foreground hairline hover:bg-panel-hi hover:hairline-hi active:bg-panel",
        link: "min-w-0 px-0 text-primary underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground hover:brightness-110 active:brightness-95",
      },
      size: {
        default: "h-9 min-w-32 px-[18px]",
        sm: "h-8 min-w-0 px-3",
        lg: "h-11 min-w-40 px-6",
        icon: "size-9 min-w-0 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
