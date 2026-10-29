"use client"

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"

/** Static operator card — the hackathon demo skips real authentication. */
export function NavUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex w-full items-center gap-2 rounded-xl border border-sidebar-border/70 bg-sidebar-accent/45 p-2 text-sidebar-foreground group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-sidebar-border bg-primary/15 text-xs font-semibold text-primary">
            SO
          </span>
          <span className="grid min-w-0 text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-medium">Security Operator</span>
            <span className="truncate text-xs text-sidebar-foreground/60">
              admin · demo
            </span>
          </span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
