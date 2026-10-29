import type { Metadata } from "next"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PageHeader } from "@/components/dashboard/page-header"
import { AnomalyScoreChart } from "@/components/dashboard/charts"
import { AnomalyCard } from "@/components/dashboard/anomaly-card"
import { SeverityBadge } from "@/components/dashboard/status-badge"
import { mlAnomalies } from "@/lib/mock-data"
import { attackLabel, formatTime } from "@/lib/format"

export const metadata: Metadata = { title: "AI Anomalies" }

export default function AnomaliesPage() {
  const flagged = mlAnomalies.filter((a) => a.isAnomaly)
  const model = mlAnomalies[0]?.model ?? "—"

  return (
    <>
      <PageHeader
        title="AI Anomalies"
        description="Results from the anomaly detection model. It learns normal device behaviour and flags anything unusual, even when no rule fires."
      >
        <span className="rounded-full border px-3 py-1 font-mono text-xs text-muted-foreground">
          model: {model}
        </span>
      </PageHeader>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Anomaly score by asset</CardTitle>
          <CardDescription>
            0 = normal, 1 = extremely unusual. Scores at or above 0.6 count as
            anomalies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnomalyScoreChart anomalies={mlAnomalies} />
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {flagged.map((a) => (
          <AnomalyCard key={a.assetId + a.timestamp} anomaly={a} />
        ))}
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>All model results</CardTitle>
          <CardDescription>
            Every prediction, including normal readings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Time</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Suspected attack</TableHead>
                  <TableHead>Explanation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mlAnomalies.map((a) => (
                  <TableRow key={a.assetId + a.timestamp}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {formatTime(a.timestamp)}
                    </TableCell>
                    <TableCell className="font-medium">{a.assetId}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {a.anomalyScore.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={a.severity} />
                    </TableCell>
                    <TableCell>{attackLabel(a.suspectedAttack)}</TableCell>
                    <TableCell className="max-w-md whitespace-normal text-muted-foreground">
                      {a.explanation}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
