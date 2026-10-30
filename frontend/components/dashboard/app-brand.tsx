"use client"

import Link from "next/link"
import { ShieldHalf } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppBrand({ href = "/dashboard" }: { href?: string }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          asChild
          className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-sidebar-accent/30 text-sidebar-foreground shadow-none group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 hover:bg-sidebar-accent active:bg-sidebar-accent dark:bg-sidebar-accent/60 dark:hover:bg-sidebar-accent"
        >
          <Link href={href} className="gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldHalf className="size-4" />
            </span>
            <span className="grid min-w-0 leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-semibold">SentinelAI</span>
              <span className="truncate text-xs text-muted-foreground">
                IoT / OT Defense
              </span>
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
