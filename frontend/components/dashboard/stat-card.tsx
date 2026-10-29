import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Sparkline } from "@/components/dashboard/sparkline"
import type { DashboardStat } from "@/lib/types"

/**
 * Analytics card — generous rounding, a large value, a delta chip and a soft
 * sparkline pinned to the bottom. `delta` is "good" when positive.
 */
export function StatCard({ stat }: { stat: DashboardStat }) {
  const positive = stat.delta >= 0
  const Arrow = positive ? ArrowUpRight : ArrowDownRight

  return (
    <Card className="gap-0 overflow-hidden rounded-2xl py-0">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            {stat.label}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
              positive
                ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400"
                : "bg-destructive/12 text-destructive"
            )}
          >
            <Arrow className="size-3" />
            {Math.abs(stat.delta)}%
          </span>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1">
            <div className="text-3xl font-semibold tracking-tight tabular-nums">
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground">{stat.hint}</p>
          </div>
          <Sparkline
            data={stat.trend}
            area
            className={cn(
              "h-12 w-28 shrink-0",
              positive ? "text-emerald-500" : "text-destructive"
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
