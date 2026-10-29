/**
 * Shared data contracts. These match what the backend (NestJS) and the ML
 * service will send, so swapping mock data for real data needs no UI changes.
 */

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export type AttackType =
  | "UNAUTH_DEFROST"
  | "DEFROST_FLOOD"
  | "SETPOINT_TAMPER"
  | "DEFAULT_CREDENTIALS"
  | "CREDENTIAL_STUFFING"
  | "PRIVILEGE_ESCALATION"
  | "MFA_DISABLED"
  | "KNOWN_CVE"

export type AssetType =
  | "refrigeration"
  | "building"
  | "transport"
  | "energy"
  | "warehouse"
  | "iot"

export type AssetStatus = "healthy" | "warning" | "under_attack" | "recovered"

export type FindingStatus = "OPEN" | "PATCHED" | "VERIFIED"

/** REDTEAM = our agent exploited it; CVE = matched against a public CVE feed. */
export type FindingSource = "REDTEAM" | "CVE"

/** CVE details, as the backend gets them from the NVD API + CISA KEV feed. */
export interface CveInfo {
  id: string
  cvss: number
  product: string
  version: string
  fixedIn: string
  publishedAt: string
  /** Listed in CISA's Known Exploited Vulnerabilities catalog. */
  knownExploited?: boolean
  url: string
}

/** Finding — the JSON shape the team agreed on, plus source/cve. */
export interface Finding {
  id: string
  assetId: string
  attack: AttackType
  severity: Severity
  evidence: string
  impactEur: number
  status: FindingStatus
  recommendation: string
  foundAt: string
  source: FindingSource
  cve?: CveInfo
}

/** ML anomaly result — see docs/ml-contract.md. */
export interface MlAnomaly {
  assetId: string
  timestamp: string
  anomalyScore: number
  isAnomaly: boolean
  severity: Severity
  suspectedAttack: AttackType | null
  topFeatures: {
    feature: string
    value: number
    normalRange: [number, number]
  }[]
  explanation: string
  model: string
}

export interface Asset {
  id: string
  name: string
  type: AssetType
  site: string
  status: AssetStatus
  temperature?: number
  inventoryValueEur: number
  lastAudit: string | null
}

export type IncidentKind =
  | "INFO"
  | "ATTACK"
  | "DETECTION"
  | "RESPONSE"
  | "RECOVERED"

export interface Incident {
  id: string
  timestamp: string
  assetId: string
  kind: IncidentKind
  title: string
  detail: string
}

export type UserRole = "admin" | "operator" | "technician"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  site: string
  mfaEnabled: boolean
  status: "active" | "locked"
  tokenLifetimeHours: number
  lastLoginAt: string
  lastLoginIp: string
}

export interface LoginEvent {
  id: string
  userId: string
  timestamp: string
  ip: string
  location: string
  success: boolean
}

/** An allowed company IP range (allowlist). */
export interface CompanyNetwork {
  cidr: string
  label: string
}

export interface TelemetryPoint {
  time: string
  temperature: number
  failedLogins: number
  riskScore: number
}

export interface DashboardStat {
  key: string
  label: string
  value: string
  hint: string
  delta: number
  trend: number[]
}
