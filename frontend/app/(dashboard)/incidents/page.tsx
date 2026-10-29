import type { Metadata } from "next"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/dashboard/page-header"
import { IncidentTimeline } from "@/components/dashboard/incident-timeline"
import { incidents } from "@/lib/mock-data"

export const metadata: Metadata = { title: "Incidents" }

export default function IncidentsPage() {
  return (
    <>
      <PageHeader
        title="Incidents"
        description="Everything that happened, in order: attacks, AI detections and automatic responses."
      />

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
          <CardDescription>29 Oct 2026 · times in UTC</CardDescription>
        </CardHeader>
        <CardContent>
          <IncidentTimeline incidents={incidents} />
        </CardContent>
      </Card>
    </>
  )
}
