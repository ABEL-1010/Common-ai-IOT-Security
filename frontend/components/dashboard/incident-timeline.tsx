import {
  CheckCircle2,
  Info,
  ShieldAlert,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { formatTime } from "@/lib/format"
import type { Incident, IncidentKind } from "@/lib/types"

const KIND: Record<IncidentKind, { icon: LucideIcon; className: string }> = {
  INFO: { icon: Info, className: "bg-muted text-muted-foreground" },
  ATTACK: { icon: ShieldAlert, className: "bg-destructive/12 text-destructive" },
  DETECTION: {
    icon: Sparkles,
    className: "bg-amber-500/12 text-amber-700 dark:text-amber-400",
  },
  RESPONSE: {
    icon: Wrench,
    className: "bg-sky-500/12 text-sky-700 dark:text-sky-400",
  },
  RECOVERED: {
    icon: CheckCircle2,
    className: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  },
}

export function IncidentTimeline({ incidents }: { incidents: Incident[] }) {
  return (
    <ol className="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-4 before:w-px before:bg-border">
      {incidents.map((incident) => {
        const { icon: Icon, className } = KIND[incident.kind]
        return (
          <li key={incident.id} className="relative flex gap-3">
            <span
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full ring-4 ring-card",
                className
              )}
            >
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 pt-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {formatTime(incident.timestamp)}
                </span>
                <span className="text-sm font-medium">{incident.title}</span>
                <span className="text-xs text-muted-foreground">
                  {incident.assetId}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{incident.detail}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
