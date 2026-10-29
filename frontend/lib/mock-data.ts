import findingsJson from "@/data/findings.json"
import anomaliesJson from "@/data/ml-anomalies.json"
import type {
  Asset,
  Finding,
  CompanyNetwork,
  Incident,
  LoginEvent,
  MlAnomaly,
  TelemetryPoint,
  User,
} from "@/lib/types"

/**
 * Mock data for the hackathon demo. Replace these exports with API calls /
 * Socket.IO streams once the backend is ready — the shapes stay the same.
 */

export const findings = findingsJson as Finding[]

export const mlAnomalies = anomaliesJson as MlAnomaly[]

export const assets: Asset[] = [
  { id: "fridge_01", name: "Store Refrigerator", type: "refrigeration", site: "Store Paris 01", status: "recovered", temperature: 4.1, inventoryValueEur: 35000, lastAudit: "2026-10-29T09:02:00Z" },
  { id: "freezer_03", name: "Frozen Goods Freezer", type: "refrigeration", site: "Store Paris 01", status: "under_attack", temperature: -9.4, inventoryValueEur: 50000, lastAudit: "2026-10-29T09:04:00Z" },
  { id: "fridge_02", name: "Dairy Cooler", type: "refrigeration", site: "Store Lyon 02", status: "healthy", temperature: 3.8, inventoryValueEur: 22000, lastAudit: "2026-10-29T08:40:00Z" },
  { id: "freezer_04", name: "Ice Cream Freezer", type: "refrigeration", site: "Store Lyon 02", status: "healthy", temperature: -19.2, inventoryValueEur: 18000, lastAudit: "2026-10-29T08:41:00Z" },
  { id: "hvac_02", name: "Rooftop HVAC", type: "building", site: "Store Paris 01", status: "warning", inventoryValueEur: 12000, lastAudit: "2026-10-29T09:05:00Z" },
  { id: "hvac_05", name: "Warehouse HVAC", type: "building", site: "DC Marseille", status: "healthy", inventoryValueEur: 15000, lastAudit: "2026-10-29T08:30:00Z" },
  { id: "ev_01", name: "EV Charger Bay A", type: "energy", site: "Store Lyon 02", status: "healthy", inventoryValueEur: 9000, lastAudit: "2026-10-29T08:20:00Z" },
  { id: "ev_02", name: "EV Charger Bay B", type: "energy", site: "Store Lyon 02", status: "healthy", inventoryValueEur: 9000, lastAudit: "2026-10-29T08:20:00Z" },
  { id: "board_01", name: "Train Info Board", type: "transport", site: "Gare Centrale", status: "healthy", inventoryValueEur: 6000, lastAudit: "2026-10-29T08:10:00Z" },
  { id: "wh_dock_01", name: "Loading Dock Controller", type: "warehouse", site: "DC Marseille", status: "healthy", inventoryValueEur: 30000, lastAudit: "2026-10-29T08:35:00Z" },
  { id: "sensor_11", name: "Door Sensor Cluster", type: "iot", site: "Store Paris 01", status: "healthy", inventoryValueEur: 2000, lastAudit: "2026-10-29T08:50:00Z" },
  { id: "sensor_12", name: "Humidity Sensors", type: "iot", site: "DC Marseille", status: "healthy", inventoryValueEur: 2000, lastAudit: null },
  { id: "cam_01", name: "Cold Room Camera", type: "iot", site: "Store Paris 01", status: "warning", inventoryValueEur: 3000, lastAudit: "2026-10-29T08:55:00Z" },
]

export const incidents: Incident[] = [
  { id: "i_1", timestamp: "2026-10-29T09:12:00Z", assetId: "fridge_01", kind: "INFO", title: "User login", detail: "operator@store-paris01 signed in." },
  { id: "i_2", timestamp: "2026-10-29T09:14:00Z", assetId: "fridge_01", kind: "ATTACK", title: "15 failed logins", detail: "Credential stuffing from 198.51.100.23 (outside company IP ranges)." },
  { id: "i_3", timestamp: "2026-10-29T09:14:10Z", assetId: "fridge_01", kind: "RESPONSE", title: "Account locked", detail: "Source IP blocked for 30 minutes." },
  { id: "i_4", timestamp: "2026-10-29T09:15:00Z", assetId: "fridge_01", kind: "DETECTION", title: "AI detected defrost flood", detail: "Anomaly score 0.91 — 10 defrost cycles in the last hour." },
  { id: "i_5", timestamp: "2026-10-29T09:15:30Z", assetId: "freezer_03", kind: "DETECTION", title: "AI detected setpoint tamper", detail: "Setpoint changed to 30°C outside maintenance hours." },
  { id: "i_6", timestamp: "2026-10-29T09:15:40Z", assetId: "freezer_03", kind: "RESPONSE", title: "Auto recovery", detail: "Setpoint restored to -18°C, config change reverted." },
  { id: "i_7", timestamp: "2026-10-29T09:16:00Z", assetId: "fridge_01", kind: "RECOVERED", title: "System healthy", detail: "Behaviour back to normal after auto-recovery." },
]

/**
 * Company IP allowlist. Logins from anywhere else are flagged.
 * Public ranges use RFC 5737 documentation addresses (safe for demos).
 */
export const companyNetworks: CompanyNetwork[] = [
  { cidr: "10.20.0.0/16", label: "Store network (Paris, Lyon)" },
  { cidr: "10.30.0.0/16", label: "Distribution centre Marseille" },
  { cidr: "203.0.113.0/24", label: "HQ office / VPN egress" },
]

export const users: User[] = [
  { id: "u_1", name: "Claire Martin", email: "claire.martin@retailco.example", role: "admin", site: "HQ", mfaEnabled: true, status: "active", tokenLifetimeHours: 8, lastLoginAt: "2026-10-29T08:02:00Z", lastLoginIp: "203.0.113.14" },
  { id: "u_2", name: "Store Operator Paris", email: "operator@store-paris01.example", role: "operator", site: "Store Paris 01", mfaEnabled: true, status: "locked", tokenLifetimeHours: 12, lastLoginAt: "2026-10-29T09:12:00Z", lastLoginIp: "10.20.1.15" },
  { id: "u_3", name: "Hugo Bernard", email: "hugo.bernard@retailco.example", role: "admin", site: "Store Paris 01", mfaEnabled: false, status: "active", tokenLifetimeHours: 72, lastLoginAt: "2026-10-29T07:40:00Z", lastLoginIp: "10.20.1.22" },
  { id: "u_4", name: "FrostTech Contractor", email: "tech@frosttech.example", role: "technician", site: "Store Lyon 02", mfaEnabled: false, status: "active", tokenLifetimeHours: 168, lastLoginAt: "2026-10-29T03:12:00Z", lastLoginIp: "192.0.2.77" },
  { id: "u_5", name: "Inès Petit", email: "ines.petit@retailco.example", role: "operator", site: "DC Marseille", mfaEnabled: true, status: "active", tokenLifetimeHours: 12, lastLoginAt: "2026-10-29T06:30:00Z", lastLoginIp: "10.30.4.9" },
  { id: "u_6", name: "HVAC Maintenance", email: "hvac@maint.example", role: "technician", site: "DC Marseille", mfaEnabled: true, status: "active", tokenLifetimeHours: 24, lastLoginAt: "2026-10-28T16:45:00Z", lastLoginIp: "10.30.2.40" },
]

export const loginEvents: LoginEvent[] = [
  { id: "l_1", userId: "u_6", timestamp: "2026-10-28T16:45:00Z", ip: "10.30.2.40", location: "Marseille, FR", success: true },
  { id: "l_2", userId: "u_4", timestamp: "2026-10-29T03:12:00Z", ip: "192.0.2.77", location: "Unknown (residential ISP)", success: true },
  { id: "l_3", userId: "u_5", timestamp: "2026-10-29T06:30:00Z", ip: "10.30.4.9", location: "Marseille, FR", success: true },
  { id: "l_4", userId: "u_3", timestamp: "2026-10-29T07:40:00Z", ip: "10.20.1.22", location: "Paris, FR", success: true },
  { id: "l_5", userId: "u_1", timestamp: "2026-10-29T08:02:00Z", ip: "203.0.113.14", location: "Paris, FR (VPN)", success: true },
  { id: "l_6", userId: "u_2", timestamp: "2026-10-29T09:12:00Z", ip: "10.20.1.15", location: "Paris, FR", success: true },
  { id: "l_7", userId: "u_2", timestamp: "2026-10-29T09:14:00Z", ip: "198.51.100.23", location: "Unknown (hosting provider)", success: false },
  { id: "l_8", userId: "u_2", timestamp: "2026-10-29T09:14:05Z", ip: "198.51.100.23", location: "Unknown (hosting provider)", success: false },
  { id: "l_9", userId: "u_3", timestamp: "2026-10-29T09:14:20Z", ip: "198.51.100.23", location: "Unknown (hosting provider)", success: false },
  { id: "l_10", userId: "u_1", timestamp: "2026-10-29T09:14:30Z", ip: "198.51.100.23", location: "Unknown (hosting provider)", success: false },
]

/** One reading per 30 s for fridge_01 across the attack window. */
export const telemetry: TelemetryPoint[] = [
  { time: "09:12:00", temperature: 4.0, failedLogins: 0, riskScore: 12 },
  { time: "09:12:30", temperature: 4.1, failedLogins: 0, riskScore: 12 },
  { time: "09:13:00", temperature: 4.0, failedLogins: 1, riskScore: 12 },
  { time: "09:13:30", temperature: 4.2, failedLogins: 3, riskScore: 27 },
  { time: "09:14:00", temperature: 4.3, failedLogins: 15, riskScore: 47 },
  { time: "09:14:30", temperature: 7.9, failedLogins: 6, riskScore: 72 },
  { time: "09:15:00", temperature: 14.8, failedLogins: 0, riskScore: 102 },
  { time: "09:15:30", temperature: 11.2, failedLogins: 0, riskScore: 64 },
  { time: "09:16:00", temperature: 6.1, failedLogins: 0, riskScore: 20 },
  { time: "09:16:30", temperature: 4.4, failedLogins: 0, riskScore: 12 },
]
