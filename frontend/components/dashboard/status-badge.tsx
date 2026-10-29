import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Crosshair,
  Database,
  Globe,
  Info,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type {
  AssetStatus,
  FindingSource,
  FindingStatus,
  Severity,
  UserRole,
} from "@/lib/types"

type Tone = "neutral" | "success" | "warning" | "danger" | "info"

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground ring-border",
  success:
    "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400",
  warning:
    "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400",
  danger: "bg-destructive/10 text-destructive ring-destructive/20",
  info: "bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-400",
}

interface PillConfig {
  tone: Tone
  label: string
  icon: LucideIcon
}

export function Pill({ tone, label, icon: Icon }: PillConfig) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 border-0 px-2 py-0.5 font-medium ring-1 ring-inset",
        TONE_CLASS[tone]
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {label}
    </Badge>
  )
}

const SEVERITY_CONFIG: Record<Severity, PillConfig> = {
  CRITICAL: { tone: "danger", label: "Critical", icon: AlertOctagon },
  HIGH: { tone: "warning", label: "High", icon: AlertTriangle },
  MEDIUM: { tone: "info", label: "Medium", icon: Info },
  LOW: { tone: "neutral", label: "Low", icon: CircleDot },
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <Pill {...SEVERITY_CONFIG[severity]} />
}

const FINDING_CONFIG: Record<FindingStatus, PillConfig> = {
  OPEN: { tone: "danger", label: "Open", icon: ShieldAlert },
  PATCHED: { tone: "info", label: "Patched", icon: Wrench },
  VERIFIED: { tone: "success", label: "Verified fixed", icon: ShieldCheck },
}

export function FindingStatusBadge({ status }: { status: FindingStatus }) {
  return <Pill {...FINDING_CONFIG[status]} />
}

const SOURCE_CONFIG: Record<FindingSource, PillConfig> = {
  REDTEAM: { tone: "neutral", label: "Red Team", icon: Crosshair },
  CVE: { tone: "neutral", label: "CVE", icon: Database },
}

export function FindingSourceBadge({ source }: { source: FindingSource }) {
  return <Pill {...SOURCE_CONFIG[source]} />
}

const ASSET_CONFIG: Record<AssetStatus, PillConfig> = {
  healthy: { tone: "success", label: "Healthy", icon: CheckCircle2 },
  warning: { tone: "warning", label: "Warning", icon: AlertTriangle },
  under_attack: { tone: "danger", label: "Under attack", icon: ShieldAlert },
  recovered: { tone: "info", label: "Recovered", icon: ShieldCheck },
}

export function AssetStatusBadge({ status }: { status: AssetStatus }) {
  return <Pill {...ASSET_CONFIG[status]} />
}

const ROLE_CONFIG: Record<UserRole, PillConfig> = {
  admin: { tone: "info", label: "Admin", icon: ShieldCheck },
  operator: { tone: "neutral", label: "Operator", icon: CircleDot },
  technician: { tone: "neutral", label: "Technician", icon: Wrench },
}

export function RoleBadge({ role }: { role: UserRole }) {
  return <Pill {...ROLE_CONFIG[role]} />
}

export function NetworkBadge({ inside }: { inside: boolean }) {
  return inside ? (
    <Pill tone="success" label="Company network" icon={CheckCircle2} />
  ) : (
    <Pill tone="danger" label="Outside range" icon={Globe} />
  )
}

export function MfaBadge({ enabled }: { enabled: boolean }) {
  return enabled ? (
    <Pill tone="success" label="MFA on" icon={ShieldCheck} />
  ) : (
    <Pill tone="danger" label="MFA off" icon={ShieldAlert} />
  )
}

export function AccountStatusBadge({ status }: { status: "active" | "locked" }) {
  return status === "active" ? (
    <Pill tone="neutral" label="Active" icon={CircleDot} />
  ) : (
    <Pill tone="warning" label="Locked" icon={Lock} />
  )
}

const RISK_CONFIG: Record<string, PillConfig> = {
  SAFE: { tone: "success", label: "Safe", icon: ShieldCheck },
  WARNING: { tone: "warning", label: "Warning", icon: AlertTriangle },
  HIGH: { tone: "danger", label: "High", icon: ShieldAlert },
  CRITICAL: { tone: "danger", label: "Critical", icon: AlertOctagon },
}

export function RiskLevelBadge({ level }: { level: string }) {
  return <Pill {...(RISK_CONFIG[level] ?? RISK_CONFIG.SAFE)} />
}
