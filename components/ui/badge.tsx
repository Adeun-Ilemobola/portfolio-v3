import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border px-2 py-0.5 text-xs font-medium whitespace-nowrap backdrop-blur-md transition-all duration-300 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive/40 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/30 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-primary/15 text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)] [a]:hover:bg-primary/25 [a]:hover:border-primary/50 dark:border-primary/20 dark:bg-primary/10 dark:[a]:hover:bg-primary/20",
        secondary:
          "border-secondary/30 bg-secondary/25 text-secondary-foreground shadow-[0_0_15px_rgba(var(--secondary),0.05)] [a]:hover:bg-secondary/35 [a]:hover:border-secondary/40 dark:border-secondary/20 dark:bg-secondary/20 dark:[a]:hover:bg-secondary/30",
        destructive:
          "border-destructive/30 bg-destructive/15 text-destructive shadow-[0_0_15px_rgba(var(--destructive),0.1)] focus-visible:ring-destructive/20 [a]:hover:bg-destructive/25 dark:border-destructive/20 dark:bg-destructive/10 dark:focus-visible:ring-destructive/30 dark:[a]:hover:bg-destructive/20",
        outline:
          "border-border/40 bg-background/20 text-foreground shadow-sm [a]:hover:border-border/60 [a]:hover:bg-muted/20 dark:border-border/30 dark:bg-background/10 dark:[a]:hover:border-border/50 dark:[a]:hover:bg-muted/15",
        ghost:
          "border-transparent bg-transparent text-foreground/80 hover:bg-muted/20 hover:text-foreground dark:hover:bg-muted/15",
        link: "border-transparent bg-transparent text-primary underline-offset-4 hover:underline hover:text-primary/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }