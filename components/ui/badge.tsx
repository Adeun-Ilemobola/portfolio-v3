import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border px-2 py-0.5 text-xs font-medium whitespace-nowrap backdrop-blur-xl transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive/40 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/30 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "border-primary/15 bg-primary/85 text-primary-foreground shadow-[0_6px_18px_rgba(0,0,0,0.10)] [a]:hover:bg-primary/78 dark:border-primary/20 dark:bg-primary/90 dark:[a]:hover:bg-primary/82",
        secondary:
          "border-secondary/20 bg-secondary/75 text-secondary-foreground shadow-[0_6px_18px_rgba(0,0,0,0.08)] [a]:hover:bg-secondary/68 dark:border-secondary/20 dark:bg-secondary/80 dark:[a]:hover:bg-secondary/72",
        destructive:
          "border-destructive/20 bg-destructive/12 text-destructive focus-visible:ring-destructive/20 [a]:hover:bg-destructive/18 dark:border-destructive/20 dark:bg-destructive/18 dark:focus-visible:ring-destructive/30 dark:[a]:hover:bg-destructive/24",
        outline:
          "border-border/55 bg-background/35 text-foreground shadow-[0_6px_18px_rgba(0,0,0,0.06)] [a]:hover:bg-muted/45 [a]:hover:text-foreground dark:border-border/60 dark:bg-background/25 dark:[a]:hover:bg-muted/35",
        ghost:
          "border-transparent bg-transparent text-foreground/88 hover:border-border/35 hover:bg-muted/35 hover:text-foreground dark:hover:bg-muted/28",
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