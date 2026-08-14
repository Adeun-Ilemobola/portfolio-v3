import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input/50 bg-input/10 px-2.5 py-1 text-base text-foreground backdrop-blur-md transition-all duration-300 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/60 hover:border-input/70 hover:bg-input/15 focus-visible:border-ring/50 focus-visible:ring-[3px] focus-visible:ring-ring/20 focus-visible:shadow-[0_0_15px_rgba(var(--ring),0.15)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/5 disabled:opacity-50 aria-invalid:border-destructive/40 aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:shadow-[0_0_15px_rgba(var(--destructive),0.15)] md:text-sm dark:bg-input/10 dark:border-input/40 dark:hover:bg-input/15 dark:hover:border-input/60 dark:focus-visible:ring-ring/20 dark:focus-visible:shadow-[0_0_20px_rgba(var(--ring),0.2)] dark:disabled:bg-input/5 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  )
}

export { Input }