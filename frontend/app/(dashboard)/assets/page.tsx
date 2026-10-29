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
import { AssetStatusBadge } from "@/components/dashboard/status-badge"
import { assets } from "@/lib/mock-data"
import { formatDateTime, formatEur } from "@/lib/format"

export const metadata: Metadata = { title: "Assets" }

export default function AssetsPage() {
  return (
    <>
      <PageHeader
        title="Assets"
        description="Every connected device in the fleet: refrigeration, HVAC, EV chargers, transport boards, warehouse controllers and sensors."
      />

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Fleet</CardTitle>
          <CardDescription>{assets.length} assets across 4 sites.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Asset</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead className="text-right">Temp</TableHead>
                  <TableHead className="text-right">Value protected</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Last audit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="font-medium">{a.name}</div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {a.id}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground capitalize">
                      {a.type}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {a.site}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {a.temperature !== undefined ? `${a.temperature} °C` : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatEur(a.inventoryValueEur)}
                    </TableCell>
                    <TableCell>
                      <AssetStatusBadge status={a.status} />
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {a.lastAudit ? formatDateTime(a.lastAudit) : "Never"}
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
