import type { Metadata } from "next"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/dashboard/page-header"
import {
  FailedLoginsChart,
  RiskScoreChart,
  TemperatureChart,
} from "@/components/dashboard/charts"
import { telemetry } from "@/lib/mock-data"

export const metadata: Metadata = { title: "Monitoring" }

export default function MonitoringPage() {
  return (
    <>
      <PageHeader
        title="Monitoring"
        description="Telemetry for fridge_01 during the demo attack window, with the behavioural rule thresholds marked."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Temperature</CardTitle>
            <CardDescription>Shaded band is the normal range.</CardDescription>
          </CardHeader>
          <CardContent>
            <TemperatureChart data={telemetry} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Failed logins</CardTitle>
            <CardDescription>Per 30 s window.</CardDescription>
          </CardHeader>
          <CardContent>
            <FailedLoginsChart data={telemetry} />
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Risk score</CardTitle>
          <CardDescription>
            Sum of active event weights. 0–30 safe, 31–60 warning, 61–100 high,
            over 100 critical.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RiskScoreChart data={telemetry} />
        </CardContent>
      </Card>
    </>
  )
}
