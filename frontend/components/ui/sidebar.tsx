"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react"

import { cn } from "@/lib/utils"

type SidebarContextValue = {
  isMobile: boolean
  open: boolean
  openMobile: boolean
  setOpen: (open: boolean) => void
  setOpenMobile: (open: boolean) => void
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)")
    const onChange = () => setIsMobile(media.matches)

    onChange()
    media.addEventListener("change", onChange)

    return () => media.removeEventListener("change", onChange)
  }, [])

  return isMobile
}

function SidebarProvider({
  defaultOpen = true,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
}) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(defaultOpen)
  const [openMobile, setOpenMobile] = React.useState(false)

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((value) => !value)
      return
    }

    setOpen((value) => !value)
  }, [isMobile])

  return (
    <SidebarContext.Provider
      value={{
        isMobile,
        open,
        openMobile,
        setOpen,
        setOpenMobile,
        toggleSidebar,
      }}
    >
      <div
        data-slot="sidebar-wrapper"
        className={cn(
          "flex h-screen min-h-svh w-full max-w-full min-w-0 overflow-x-hidden bg-background",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  className,
  children,
  collapsible,
  variant,
  ...props
}: React.ComponentProps<"aside"> & {
  collapsible?: "icon" | "none"
  variant?: "inset" | "sidebar"
}) {
  const { isMobile, open, openMobile, setOpenMobile } = useSidebar()
  const isCollapsed = !isMobile && collapsible === "icon" && !open

  const content = (
    <div
      data-slot="sidebar-content-wrapper"
      data-collapsible={isCollapsed ? "icon" : undefined}
      data-variant={variant}
      className={cn(
        "group relative flex h-screen max-h-screen min-h-0 w-72 max-w-full flex-col overflow-hidden bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        isCollapsed && "w-16",
        className
      )}
    >
      {children}
    </div>
  )

  if (isMobile) {
    return (
      <>
        <div
          data-state={openMobile ? "open" : "closed"}
          className={cn(
            "fixed inset-0 z-50 bg-black/35 opacity-0 backdrop-blur-sm transition-opacity duration-200 md:hidden",
            openMobile
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none"
          )}
          onClick={() => setOpenMobile(false)}
        />
        <aside
          data-slot="sidebar"
          data-state={openMobile ? "open" : "closed"}
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex h-screen max-h-screen w-80 max-w-[calc(100vw-2rem)] -translate-x-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-200 md:hidden",
            openMobile && "translate-x-0"
          )}
          aria-hidden={!openMobile}
          {...props}
        >
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-md text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
            onClick={() => setOpenMobile(false)}
          >
            <X className="size-4" />
          </button>
          {content}
        </aside>
      </>
    )
  }

  return (
    <aside
      data-slot="sidebar"
      className={cn(
        "sticky top-0 hidden h-screen max-h-screen shrink-0 overflow-hidden border-r border-sidebar-border bg-sidebar md:flex",
        isCollapsed ? "w-16" : "w-72"
      )}
      {...props}
    >
      {content}
    </aside>
  )
}

function SidebarTrigger({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { isMobile, open, toggleSidebar } = useSidebar()
  const Icon = isMobile ? Menu : open ? PanelLeftClose : PanelLeftOpen

  return (
    <button
      type="button"
      aria-label={isMobile ? "Open navigation menu" : "Toggle sidebar"}
      data-slot="sidebar-trigger"
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className
      )}
      onClick={toggleSidebar}
      {...props}
    >
      <Icon className="size-4" />
    </button>
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-inset"
      className={cn(
        "flex h-full min-h-0 max-w-full min-w-0 flex-1 flex-col overflow-x-hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex shrink-0 flex-col gap-2", className)}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto",
        className
      )}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("flex shrink-0 flex-col gap-2", className)}
      {...props}
    />
  )
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { open, setOpen } = useSidebar()

  return (
    <button
      type="button"
      aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      data-slot="sidebar-rail"
      className={cn(
        "absolute inset-y-0 right-0 hidden w-2 translate-x-1/2 cursor-ew-resize md:block",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    />
  )
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
}

function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn("group-data-[collapsible=icon]:sr-only", className)}
      {...props}
    />
  )
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("flex min-w-0 flex-col", className)}
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn("relative min-w-0", className)}
      {...props}
    />
  )
}

function SidebarMenuButton({
  asChild = false,
  isActive,
  size = "default",
  className,
  onClick,
  tooltip: _tooltip,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  isActive?: boolean
  size?: "default" | "sm" | "lg"
  tooltip?: string
}) {
  const Comp = asChild ? Slot : "button"
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <Comp
      data-slot="sidebar-menu-button"
      data-tooltip={_tooltip}
      data-active={isActive}
      className={cn(
        "flex w-full min-w-0 items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        size === "sm" && "h-8 px-2 text-sm",
        size === "default" && "h-10 px-3 text-sm",
        size === "lg" && "h-12 px-3 text-sm",
        "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:[&_span]:sr-only",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        if (isMobile) {
          setOpenMobile(false)
        }
      }}
      {...props}
    />
  )
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      className={cn(
        "flex min-w-0 flex-col gap-1 group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      className={cn("min-w-0", className)}
      {...props}
    />
  )
}

function SidebarMenuSubButton({
  asChild = false,
  isActive,
  className,
  onClick,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  isActive?: boolean
}) {
  const Comp = asChild ? Slot : "button"
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-active={isActive}
      className={cn(
        "flex w-full min-w-0 items-center rounded-md px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        if (isMobile) {
          setOpenMobile(false)
        }
      }}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
}
