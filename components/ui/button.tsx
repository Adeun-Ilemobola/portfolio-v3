import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border bg-clip-padding text-sm font-medium whitespace-nowrap backdrop-blur-md transition-all duration-300 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive/40 aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-primary/20 text-primary shadow-[0_0_20px_rgba(var(--primary),0.15)] hover:bg-primary/30 hover:border-primary/50 hover:shadow-[0_0_25px_rgba(var(--primary),0.25)] aria-expanded:bg-primary/30 dark:border-primary/20 dark:bg-primary/15 dark:hover:bg-primary/25 dark:hover:border-primary/40",
        outline:
          "border-border/40 bg-background/20 text-foreground shadow-sm hover:bg-muted/20 hover:border-border/60 aria-expanded:bg-muted/20 dark:border-border/30 dark:bg-background/10 dark:hover:bg-muted/15 dark:hover:border-border/50",
        secondary:
          "border-secondary/30 bg-secondary/25 text-secondary-foreground shadow-sm hover:bg-secondary/35 hover:border-secondary/50 aria-expanded:bg-secondary/35 dark:border-secondary/20 dark:bg-secondary/15 dark:hover:bg-secondary/25",
        ghost:
          "border-transparent bg-transparent text-foreground/80 hover:border-border/30 hover:bg-muted/20 hover:text-foreground aria-expanded:border-border/30 aria-expanded:bg-muted/20 dark:hover:bg-muted/15 dark:hover:border-border/30",
        destructive:
          "border-destructive/30 bg-destructive/15 text-destructive shadow-[0_0_15px_rgba(var(--destructive),0.1)] hover:bg-destructive/25 hover:border-destructive/50 focus-visible:border-destructive/35 focus-visible:ring-destructive/20 dark:border-destructive/20 dark:bg-destructive/10 dark:hover:bg-destructive/20 dark:focus-visible:ring-destructive/30",
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