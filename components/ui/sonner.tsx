"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-primary" />,
        info: <InfoIcon className="size-4 text-foreground/80" />,
        warning: <TriangleAlertIcon className="size-4 text-secondary" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
        loading: <Loader2Icon className="size-4 animate-spin text-primary" />,
      }}
      style={
        {
          "--normal-bg": "transparent",
          "--normal-text": "var(--foreground)",
          "--normal-border": "transparent",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast group toast backdrop-blur-md border border-border/30 bg-background/20 text-foreground shadow-[0_8px_24px_rgba(0,0,0,0.05)] transition-all duration-300 dark:border-border/20 dark:bg-background/10 dark:shadow-[0_12px_40px_rgba(0,0,0,0.2)]",
          description: "text-muted-foreground/80",
          actionButton:
            "bg-primary/15 text-primary border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.1)] hover:bg-primary/25 hover:border-primary/50 transition-all duration-300",
          cancelButton:
            "bg-muted/10 text-muted-foreground border border-border/30 hover:bg-muted/20 hover:border-border/50 transition-all duration-300",
          closeButton:
            "bg-background/20 border border-border/30 text-foreground hover:bg-muted/20 backdrop-blur-md transition-all duration-300",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }