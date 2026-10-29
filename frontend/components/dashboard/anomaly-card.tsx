import { BrainCircuit } from "lucide-react"

import { SeverityBadge } from "@/components/dashboard/status-badge"
import { attackLabel, formatTime } from "@/lib/format"
import type { MlAnomaly } from "@/lib/types"

/** One ML anomaly: what, why (explanation + top features) and how sure. */
export function AnomalyCard({ anomaly }: { anomaly: MlAnomaly }) {
  return (
    <div className="space-y-3 rounded-xl border p-4">
      <div className="flex flex-wrap items-center gap-2">
        <BrainCircuit className="size-4 text-primary" aria-hidden />
        <span className="font-medium">
          {attackLabel(anomaly.suspectedAttack)}
        </span>
        <SeverityBadge severity={anomaly.severity} />
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {anomaly.assetId} · {formatTime(anomaly.timestamp)}
        </span>
      </div>

      <p className="text-sm text-muted-foreground">{anomaly.explanation}</p>

      {anomaly.topFeatures.length ? (
        <div className="flex flex-wrap gap-2">
          {anomaly.topFeatures.map((f) => (
            <span
              key={f.feature}
              className="rounded-lg bg-muted px-2 py-1 font-mono text-xs"
            >
              {f.feature}: <strong className="font-semibold">{f.value}</strong>{" "}
              <span className="text-muted-foreground">
                (normal {f.normalRange[0]}–{f.normalRange[1]})
              </span>
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-destructive"
            style={{ width: `${Math.round(anomaly.anomalyScore * 100)}%` }}
          />
        </div>
        <span className="text-xs font-medium tabular-nums">
          score {anomaly.anomalyScore.toFixed(2)}
        </span>
      </div>
    </div>
  )
}
