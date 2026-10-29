"use client"

import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { findNavByPath } from "@/components/dashboard/nav-config"

export function SiteHeader() {
  const pathname = usePathname()
  const current = findNavByPath(pathname)

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/85 backdrop-blur-xl transition-[width,height] ease-linear sm:h-16">
      <div className="flex w-full min-w-0 items-center gap-2 px-3 sm:px-4 lg:px-6">
        <SidebarTrigger className="-ml-1 rounded-xl" />
        <Separator
          orientation="vertical"
          className="mx-1 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb className="min-w-0">
          <BreadcrumbList>
            <BreadcrumbItem className="hidden sm:block">
              <span className="text-muted-foreground">SentinelAI</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate">
                {current?.title ?? "Overview"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
            Mock data
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
