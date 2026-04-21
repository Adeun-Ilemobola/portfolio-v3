
import StarfieldBackground from "@/components/Starfield";
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

import type { Metadata } from "next";
import { Inter, Merriweather, JetBrains_Mono } from "next/font/google";


const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Merriweather({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`, fontMono.variable, "font-sans", )}
    >
      <body>
        <ThemeProvider>
          {children}
          <StarfieldBackground />
          </ThemeProvider>
      </body>
    </html>
  )
}
