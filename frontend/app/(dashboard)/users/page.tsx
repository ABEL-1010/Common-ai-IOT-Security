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
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/dashboard/page-header"
import {
  AccountStatusBadge,
  MfaBadge,
  NetworkBadge,
  RoleBadge,
} from "@/components/dashboard/status-badge"
import { companyNetworks, loginEvents, users } from "@/lib/mock-data"
import { matchCompanyNetwork } from "@/lib/network"
import { formatDateTime } from "@/lib/format"

export const metadata: Metadata = { title: "Users & Access" }

/** Spec: token lifetime over 24 hours generates a warning. */
const MAX_TOKEN_HOURS = 24

function SummaryCard({
  label,
  value,
  hint,
  alert,
}: {
  label: string
  value: number
  hint: string
  alert?: boolean
}) {
  return (
    <Card className="gap-1 rounded-2xl py-4">
      <CardContent className="space-y-1">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        <div
          className={cn(
            "text-3xl font-semibold tabular-nums",
            alert && value > 0 && "text-destructive"
          )}
        >
          {value}
        </div>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}

export default function UsersPage() {
  const userById = new Map(users.map((u) => [u.id, u]))
  const logins = [...loginEvents].sort((a, b) =>
    b.timestamp.localeCompare(a.timestamp)
  )
  const outsideLogins = logins.filter(
    (l) => !matchCompanyNetwork(l.ip, companyNetworks)
  )
  const outsideIps = new Set(outsideLogins.map((l) => l.ip))
  const noMfa = users.filter((u) => !u.mfaEnabled)
  const longTokens = users.filter((u) => u.tokenLifetimeHours > MAX_TOKEN_HOURS)

  return (
    <>
      <PageHeader
        title="Users & Access"
        description="Who can control the devices, with which role, and where they logged in from. Logins from outside the company IP ranges are flagged."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Users"
          value={users.length}
          hint={`${users.filter((u) => u.role === "admin").length} admins`}
        />
        <SummaryCard
          label="Logins outside range"
          value={outsideLogins.length}
          hint={`from ${outsideIps.size} unknown IP${outsideIps.size === 1 ? "" : "s"}`}
          alert
        />
        <SummaryCard
          label="MFA disabled"
          value={noMfa.length}
          hint="accounts without a second factor"
          alert
        />
        <SummaryCard
          label="Tokens over 24h"
          value={longTokens.length}
          hint="session lifetime above policy"
          alert
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Roles should follow least privilege: technicians never need admin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow className="hover:bg-transparent">
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>MFA</TableHead>
                    <TableHead className="text-right">Token</TableHead>
                    <TableHead>Last login IP</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => {
                    const inside = Boolean(
                      matchCompanyNetwork(u.lastLoginIp, companyNetworks)
                    )
                    return (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {u.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <RoleBadge role={u.role} />
                        </TableCell>
                        <TableCell>
                          <MfaBadge enabled={u.mfaEnabled} />
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-right tabular-nums",
                            u.tokenLifetimeHours > MAX_TOKEN_HOURS &&
                              "font-medium text-destructive"
                          )}
                        >
                          {u.tokenLifetimeHours}h
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-mono text-xs">
                              {u.lastLoginIp}
                            </div>
                            <NetworkBadge inside={inside} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <AccountStatusBadge status={u.status} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Company IP ranges</CardTitle>
            <CardDescription>
              Allowlist. Any login from an IP outside these ranges is flagged.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {companyNetworks.map((n) => (
              <div
                key={n.cidr}
                className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2"
              >
                <span className="font-mono text-sm">{n.cidr}</span>
                <span className="text-right text-xs text-muted-foreground">
                  {n.label}
                </span>
              </div>
            ))}
            <div className="pt-2">
              <div className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Flagged IPs
              </div>
              {[...outsideIps].map((ip) => {
                const hits = outsideLogins.filter((l) => l.ip === ip)
                return (
                  <div
                    key={ip}
                    className="mb-2 flex items-center justify-between gap-3 rounded-xl bg-destructive/10 px-3 py-2"
                  >
                    <span className="font-mono text-sm text-destructive">
                      {ip}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {hits.length} login{hits.length === 1 ? "" : "s"} ·{" "}
                      {hits[0].location}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Login activity</CardTitle>
          <CardDescription>Newest first · times in UTC</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP address</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logins.map((l) => {
                  const network = matchCompanyNetwork(l.ip, companyNetworks)
                  const user = userById.get(l.userId)
                  return (
                    <TableRow
                      key={l.id}
                      className={cn(!network && "bg-destructive/5")}
                    >
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(l.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{user?.name}</div>
                        {user ? (
                          <div className="text-xs text-muted-foreground capitalize">
                            {user.role}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{l.ip}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {network ? network.label : l.location}
                      </TableCell>
                      <TableCell>
                        <NetworkBadge inside={Boolean(network)} />
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-sm font-medium",
                          l.success ? "" : "text-destructive"
                        )}
                      >
                        {l.success ? "Success" : "Failed"}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
