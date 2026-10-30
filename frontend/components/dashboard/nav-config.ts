import {
  Activity,
  BrainCircuit,
  Bug,
  History,
  LayoutDashboard,
  Server,
  Users,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
}

/** Primary navigation — drives the sidebar (NavMain) and breadcrumbs. */
export const dashboardNav: NavItem[] = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Assets", url: "/assets", icon: Server },
  { title: "Findings", url: "/findings", icon: Bug },
  { title: "Users & Access", url: "/users", icon: Users },
  { title: "AI Anomalies", url: "/anomalies", icon: BrainCircuit },
  { title: "Monitoring", url: "/monitoring", icon: Activity },
  { title: "Incidents", url: "/incidents", icon: History },
]

export function findNavByPath(pathname: string): NavItem | undefined {
  // Longest matching url wins so /findings/x resolves to /findings.
  return [...dashboardNav]
    .sort((a, b) => b.url.length - a.url.length)
    .find(
      (item) => pathname === item.url || pathname.startsWith(`${item.url}/`)
    )
}
