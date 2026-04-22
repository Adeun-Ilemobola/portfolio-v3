import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border bg-clip-padding text-sm font-medium whitespace-nowrap backdrop-blur-xl transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive/40 aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-primary/15 bg-primary/85 text-primary-foreground shadow-[0_8px_24px_rgba(0,0,0,0.16)] hover:bg-primary/78 dark:border-primary/20 dark:bg-primary/90 dark:hover:bg-primary/82",
        outline:
          "border-border/55 bg-background/45 text-foreground shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:bg-muted/55 hover:text-foreground aria-expanded:bg-muted/60 aria-expanded:text-foreground dark:border-border/60 dark:bg-background/30 dark:hover:bg-muted/40",
        secondary:
          "border-secondary/20 bg-secondary/75 text-secondary-foreground shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:bg-secondary/68 aria-expanded:bg-secondary/72 aria-expanded:text-secondary-foreground dark:border-secondary/20 dark:bg-secondary/80 dark:hover:bg-secondary/72",
        ghost:
          "border-transparent bg-transparent text-foreground/88 hover:border-border/40 hover:bg-muted/40 hover:text-foreground aria-expanded:border-border/40 aria-expanded:bg-muted/45 aria-expanded:text-foreground dark:hover:bg-muted/28",
        destructive:
          "border-destructive/20 bg-destructive/12 text-destructive hover:bg-destructive/18 focus-visible:border-destructive/35 focus-visible:ring-destructive/20 dark:border-destructive/20 dark:bg-destructive/18 dark:hover:bg-destructive/24 dark:focus-visible:ring-destructive/30",
        link: "border-transparent bg-transparent text-primary underline-offset-4 hover:underline hover:text-primary/90",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

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
  )
}

export { Button, buttonVariants }