"use client"

import * as React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

/**
 * Global client providers.
 *
 * Order (outer → inner):
 *   ThemeProvider (next-themes, owns light/dark + the "d" hotkey)
 *   → TooltipProvider (Radix — required by the sidebar's collapsed tooltips)
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster closeButton richColors position="top-right" />
    </ThemeProvider>
  )
}
