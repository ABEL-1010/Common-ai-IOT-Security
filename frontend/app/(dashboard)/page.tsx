import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { RiskScoreChart } from "@/components/dashboard/charts"
import { AnomalyCard } from "@/components/dashboard/anomaly-card"
import { IncidentTimeline } from "@/components/dashboard/incident-timeline"
import { RiskLevelBadge } from "@/components/dashboard/status-badge"
import {
  assets,
  findings,
  incidents,
  mlAnomalies,
  telemetry,
} from "@/lib/mock-data"
import { formatCompactEur, riskLevel } from "@/lib/format"
import type { DashboardStat } from "@/lib/types"

export const metadata: Metadata = { title: "Overview" }

function buildStats(): DashboardStat[] {
  const audited = assets.filter((a) => a.lastAudit).length
  const open = findings.filter((f) => f.status === "OPEN")
  const fixed = findings.filter((f) => f.status !== "OPEN")
  const atRisk = open.reduce((sum, f) => sum + f.impactEur, 0)
  const protectedEur = fixed.reduce((sum, f) => sum + f.impactEur, 0)
  const prevented = incidents.filter((i) => i.kind === "RESPONSE").length

  return [
    {
      key: "coverage",
      label: "Fleet Coverage",
      value: `${audited}/${assets.length}`,
      hint: "assets audited by the Red Team",
      delta: 8,
      trend: [6, 7, 8, 8, 9, 10, 11, audited],
    },
    {
      key: "open",
      label: "Open Findings",
      value: String(open.length),
      hint: `${formatCompactEur(atRisk)} inventory at risk`,
      delta: -25,
      trend: [9, 8, 8, 7, 6, 5, 4, open.length],
    },
    {
      key: "protected",
      label: "€ Protected",
      value: formatCompactEur(protectedEur),
      hint: "risk removed by patches",
      delta: 40,
      trend: [10, 18, 25, 30, 40, 52, 60, protectedEur / 1000],
    },
    {
      key: "prevented",
      label: "Threats Prevented",
      value: String(prevented + 22),
      hint: "0 min physical downtime",
      delta: 12,
      trend: [12, 14, 15, 17, 18, 20, 22, prevented + 22],
    },
  ]
}

export default function OverviewPage() {
  const stats = buildStats()
  const current = telemetry[telemetry.length - 1]
  const peak = Math.max(...telemetry.map((t) => t.riskScore))
  const latestAnomalies = mlAnomalies.filter((a) => a.isAnomaly).slice(-2)

  return (
    <>
      <PageHeader
        title="Overview"
        description="Fleet security posture, live risk score and the latest AI detections across all IoT / OT assets."
      >
        <div className="flex items-center gap-3 rounded-2xl border bg-background px-4 py-2">
          <div>
            <div className="text-xs text-muted-foreground">Security score</div>
            <div className="text-2xl font-semibold tabular-nums">
              {100 - current.riskScore}
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </div>
          <RiskLevelBadge level={riskLevel(current.riskScore)} />
        </div>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.key} stat={stat} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Risk score — fridge_01</CardTitle>
            <CardDescription>
              Peaked at {peak} during the attack, back to {current.riskScore}{" "}
              after auto-recovery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RiskScoreChart data={telemetry} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Incident timeline</CardTitle>
            <CardDescription>Attack → detection → recovery</CardDescription>
          </CardHeader>
          <CardContent>
            <IncidentTimeline incidents={incidents.slice(-5)} />
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>Latest AI detections</CardTitle>
            <CardDescription>
              Isolation Forest flagged behaviour that fixed rules would miss.
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/anomalies">View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {latestAnomalies.map((a) => (
            <AnomalyCard key={a.assetId + a.timestamp} anomaly={a} />
          ))}
        </CardContent>
      </Card>
    </>
  )
}
