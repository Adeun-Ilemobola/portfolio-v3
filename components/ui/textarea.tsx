import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input/50 bg-input/10 px-2.5 py-2 text-base text-foreground backdrop-blur-md transition-all duration-300 outline-none placeholder:text-muted-foreground/60 hover:border-input/70 hover:bg-input/15 focus-visible:border-ring/50 focus-visible:ring-[3px] focus-visible:ring-ring/20 focus-visible:shadow-[0_0_15px_rgba(var(--ring),0.15)] disabled:cursor-not-allowed disabled:bg-input/5 disabled:opacity-50 aria-invalid:border-destructive/40 aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:shadow-[0_0_15px_rgba(var(--destructive),0.15)] md:text-sm dark:bg-input/10 dark:border-input/40 dark:hover:bg-input/15 dark:hover:border-input/60 dark:focus-visible:ring-ring/20 dark:focus-visible:shadow-[0_0_20px_rgba(var(--ring),0.2)] dark:disabled:bg-input/5 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }