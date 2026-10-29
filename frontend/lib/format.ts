import type { AttackType, Severity } from "@/lib/types"

const eur = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})

const eurCompact = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
  maximumFractionDigits: 1,
})

export function formatEur(value: number) {
  return eur.format(value)
}

export function formatCompactEur(value: number) {
  return eurCompact.format(value)
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  })
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  })
}

const ATTACK_LABELS: Record<AttackType, string> = {
  UNAUTH_DEFROST: "Unauthenticated defrost",
  DEFROST_FLOOD: "Defrost flood",
  SETPOINT_TAMPER: "Setpoint tamper",
  DEFAULT_CREDENTIALS: "Default credentials",
  CREDENTIAL_STUFFING: "Credential stuffing",
  PRIVILEGE_ESCALATION: "Privilege escalation",
  MFA_DISABLED: "MFA disabled",
  KNOWN_CVE: "Known CVE",
}

export function attackLabel(attack: AttackType | null) {
  return attack ? ATTACK_LABELS[attack] : "—"
}

export const SEVERITY_ORDER: Record<Severity, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
}

/** Spec thresholds: 0-30 Safe, 31-60 Warning, 61-100 High, 100+ Critical. */
export function riskLevel(score: number) {
  if (score > 100) return "CRITICAL"
  if (score > 60) return "HIGH"
  if (score > 30) return "WARNING"
  return "SAFE"
}
