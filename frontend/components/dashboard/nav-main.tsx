"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { dashboardNav } from "@/components/dashboard/nav-config"
import {
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const NAV_ITEM =
  "h-11 gap-3 rounded-xl px-3 font-medium text-muted-foreground transition-all hover:bg-background hover:text-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-md data-[active=true]:shadow-primary/15"

export function NavMain() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  const isActive = (url: string) =>
    pathname === url || (url !== "/" && pathname.startsWith(`${url}/`))
  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarGroup className="px-2">
      <SidebarGroupLabel className="mb-1 px-3 text-[0.68rem] font-semibold tracking-[0.18em] text-muted-foreground/70 uppercase">
        Defense
      </SidebarGroupLabel>
      <SidebarGroup>
        <SidebarMenu className="gap-1">
          {dashboardNav.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.url)}
                tooltip={item.title}
                className={NAV_ITEM}
              >
                <Link href={item.url} onClick={closeMobileSidebar}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarGroup>
  )
}
