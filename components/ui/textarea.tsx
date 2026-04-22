import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input/60 bg-input/40 px-2.5 py-2 text-base text-foreground backdrop-blur-xl transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:bg-input/28 disabled:opacity-50 aria-invalid:border-destructive/40 aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:border-input/65 dark:bg-input/30 dark:disabled:bg-input/22 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }