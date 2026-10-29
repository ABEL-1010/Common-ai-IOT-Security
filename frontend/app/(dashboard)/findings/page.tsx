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
import {
  FindingSourceBadge,
  FindingStatusBadge,
  SeverityBadge,
} from "@/components/dashboard/status-badge"
import { findings } from "@/lib/mock-data"
import { SEVERITY_ORDER, attackLabel, formatEur } from "@/lib/format"
import type { Finding } from "@/lib/types"

function IssueCell({ finding }: { finding: Finding }) {
  if (!finding.cve) {
    return <span className="font-medium">{attackLabel(finding.attack)}</span>
  }

  const { cve } = finding
  return (
    <div className="space-y-1">
      <a
        href={cve.url}
        target="_blank"
        rel="noreferrer"
        className="font-mono text-sm font-medium underline-offset-4 hover:underline"
      >
        {cve.id}
      </a>
      <div className="text-xs text-muted-foreground">
        {cve.product} {cve.version} → fixed in {cve.fixedIn}
      </div>
      <div className="flex flex-wrap gap-1">
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium tabular-nums">
          CVSS {cve.cvss.toFixed(1)}
        </span>
        {cve.knownExploited ? (
          <span className="rounded-md bg-destructive/10 px-1.5 py-0.5 text-xs font-medium text-destructive">
            Exploited in the wild
          </span>
        ) : null}
      </div>
    </div>
  )
}

export const metadata: Metadata = { title: "Findings" }

export default function FindingsPage() {
  const sorted = [...findings].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  )
  const atRisk = findings
    .filter((f) => f.status === "OPEN")
    .reduce((sum, f) => sum + f.impactEur, 0)
  const cveCount = findings.filter((f) => f.source === "CVE").length

  return (
    <>
      <PageHeader
        title="Findings"
        description="Vulnerabilities from two sources: the Red Team agent attacking our own devices, and device software matched against public CVE databases (NVD, CISA KEV)."
      >
        <div className="rounded-2xl border bg-background px-4 py-2">
          <div className="text-xs text-muted-foreground">Open € at risk</div>
          <div className="text-2xl font-semibold text-destructive tabular-nums">
            {formatEur(atRisk)}
          </div>
        </div>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="gap-1 rounded-2xl py-4">
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Red Team agent
              </span>
              <FindingSourceBadge source="REDTEAM" />
            </div>
            <div className="text-3xl font-semibold tabular-nums">
              {findings.length - cveCount}
            </div>
            <p className="text-xs text-muted-foreground">
              found by actively attacking our own devices
            </p>
          </CardContent>
        </Card>
        <Card className="gap-1 rounded-2xl py-4">
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                CVE feed
              </span>
              <FindingSourceBadge source="CVE" />
            </div>
            <div className="text-3xl font-semibold tabular-nums">
              {cveCount}
            </div>
            <p className="text-xs text-muted-foreground">
              NVD API 2.0 + CISA KEV · last sync 08:55 UTC
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>All findings</CardTitle>
          <CardDescription>
            Open → Patched → Verified fixed (re-tested by the Red Team).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Issue</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead className="text-right">Impact</TableHead>
                  <TableHead>Evidence</TableHead>
                  <TableHead>Recommendation</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="whitespace-normal">
                      <IssueCell finding={f} />
                    </TableCell>
                    <TableCell>
                      <FindingSourceBadge source={f.source} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {f.assetId}
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={f.severity} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatEur(f.impactEur)}
                    </TableCell>
                    <TableCell className="max-w-56 font-mono text-xs whitespace-normal text-muted-foreground">
                      {f.evidence}
                    </TableCell>
                    <TableCell className="max-w-72 whitespace-normal text-muted-foreground">
                      {f.recommendation}
                    </TableCell>
                    <TableCell>
                      <FindingStatusBadge status={f.status} />
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
