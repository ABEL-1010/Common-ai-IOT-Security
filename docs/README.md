# SentinelAI — Project Guide

Cyber-physical defense for IoT / OT fleets (supermarket fridges, freezers, HVAC,
EV chargers, transport boards, warehouse controllers, sensors).

> **Status (29 Oct 2026):** the dashboard is built and runs on **mock data**.
> Backend (NestJS), Red Team agent and ML service are not connected yet. Every
> data shape the dashboard uses is defined below, so each team can build its
> part to match.

---

## 1. The idea

Companies protect payment systems but ignore devices like freezers and HVAC
because they hold no financial data. Attackers who just want to cause damage
can still use them for physical disruption, for example forcing defrost cycles
on supermarket freezers and spoiling the stock inside.

SentinelAI protects these devices in four ways:

| Layer | What it does | Who builds it |
|---|---|---|
| **Red Team agent** | Attacks our own devices on a schedule (default passwords, unauthenticated endpoints, no rate limits, bad setpoints) to find holes before real attackers do | Python |
| **CVE matching** | Compares each device's software versions with public vulnerability databases (NVD, CISA KEV) | Backend |
| **AI anomaly detection** | An Isolation Forest model learns normal device behaviour and flags anything unusual, even when no fixed rule fires | Python (ML) |
| **Auto response** | When an attack is detected: restore the setpoint, lock the account, block the IP, block defrost | Backend |

**Important:** the ML only *detects*. The backend's response engine does the
*fixing*.

### Demo story

1. Fleet looks healthy, but it has never been audited.
2. Red Team runs and finds vulnerabilities, e.g. "Defrost abuse: €40,000 at risk".
3. Patches are applied, then the Red Team re-tests them and marks them **Verified fixed**.
4. A simulated hacker attacks: 15 failed logins, then a defrost flood, then the setpoint is set to 30°C.
5. AI detects it, the system recovers automatically, and physical downtime stays at **0 minutes**.

---

## 2. Architecture

```
[Python Red Team] ──attacks──▶ [Device simulator] ◀──telemetry── [NestJS backend]
        │                                                       │   ▲
        └────────── findings ──────────────▶ PostgreSQL ◀───────┘   │ POST /predict
                                              (Prisma)              │
                                                 │            [ML service :8000]
                                                 ▼
                                    [Next.js dashboard] ◀── Socket.IO (live events)
```

| Part | Tech |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind v4, shadcn/ui, Recharts |
| Backend | NestJS, Prisma, PostgreSQL, Socket.IO |
| ML | Python, scikit-learn (Isolation Forest), FastAPI |
| Red Team | Python |

---

## 3. Running the dashboard

```bash
cd frontend
pnpm install
pnpm dev          # http://localhost:3000 (landing page, then sign in)
pnpm build        # production build (also type-checks)
```

Press **`d`** anywhere to toggle light / dark mode.

---

## 4. Frontend structure

The layout and design are copied from `ptgr-front-end` (same sidebar, header,
cards, badges and gold theme).

```
frontend/
├── app/
│   ├── layout.tsx               Root layout (fonts, providers)
│   ├── globals.css              Theme tokens (copied from PTGR + chart colours)
│   ├── page.tsx                 /            Landing page + demo login
│   └── (dashboard)/
│       ├── layout.tsx           Sidebar + header shell
│       ├── dashboard/           /dashboard   Overview
│       ├── assets/              /assets      Fleet list
│       ├── findings/            /findings    Red Team + CVE findings
│       ├── users/               /users       Users, roles, login IPs
│       ├── anomalies/           /anomalies   ML results
│       ├── monitoring/          /monitoring  Telemetry charts
│       └── incidents/           /incidents   Timeline
├── components/
│   ├── ui/                      shadcn components (copied from PTGR)
│   ├── dashboard/               App components (sidebar, header, cards, charts, badges…)
│   ├── providers.tsx            Theme + tooltip + toast providers
│   └── theme-provider.tsx
├── data/
│   ├── findings.json            Mock findings (Red Team + CVE)
│   └── ml-anomalies.json        Mock ML output
└── lib/
    ├── types.ts                 ⭐ All data contracts
    ├── mock-data.ts             ⭐ All mock data — the only file to swap for real APIs
    ├── format.ts                € / time formatting, labels, risk thresholds
    ├── network.ts               IP-in-CIDR check for the company IP allowlist
    └── utils.ts                 cn() helper
```

### Key components (`components/dashboard/`)

| File | Purpose |
|---|---|
| `app-sidebar.tsx`, `nav-main.tsx`, `nav-config.ts` | Sidebar and navigation (add pages in `nav-config.ts`) |
| `site-header.tsx` | Sticky header with breadcrumb and theme toggle |
| `page-header.tsx` | Title card at the top of each page |
| `stat-card.tsx`, `sparkline.tsx` | KPI cards with trend line |
| `status-badge.tsx` | Every coloured pill: severity, status, role, MFA, network, source |
| `charts.tsx` | Recharts: risk score, temperature, failed logins, anomaly score |
| `anomaly-card.tsx` | One ML detection with explanation and features |
| `incident-timeline.tsx` | Vertical timeline of events |

---

## 5. Pages

### Landing `/`
Product summary and a demo sign-in form. The sample credentials are shown on the
page and defined in `frontend/lib/demo-auth.ts`. This is a front-end mock only:
nothing is sent to a server and the dashboard routes are not protected.

### Overview `/dashboard`
- Security score (100 − risk score) and risk level badge
- Stat cards: **Fleet coverage** (assets audited / total), **Open findings** (+ € at risk), **€ protected**, **Threats prevented** (+ 0 min downtime)
- Risk score chart for `fridge_01` (12 → 102 → 12)
- Latest incident timeline and latest AI detections

### Assets `/assets`
13 devices across 6 types (refrigeration, building, energy, transport,
warehouse, iot) and 4 sites. Shows temperature, value protected, status and
last audit.

### Findings `/findings`
Vulnerabilities from two sources:

| Source | Meaning |
|---|---|
| **Red Team** | Our agent actually exploited it (e.g. `POST /defrost` worked without a token) |
| **CVE** | Device software matches a known public vulnerability |

CVE rows show the CVE ID (linked to NVD), product and version, fixed version,
CVSS score and an **Exploited in the wild** tag (from CISA KEV).

Status flow: **Open → Patched → Verified fixed** (re-tested by the Red Team).

Mock CVEs are real and well known: Log4Shell (CVE-2021-44228), Hikvision
camera command injection (CVE-2021-36260), Heartbleed (CVE-2014-0160). The
devices, versions and € amounts are invented for the demo.

### Users & Access `/users`
- Users with **role** (admin / operator / technician), **MFA** status, **token lifetime** (red if over 24h), **last login IP**, active / locked
- **Company IP ranges** (allowlist) and **Flagged IPs**
- **Login activity** log; logins from outside the company ranges are highlighted

Outside-range detection is calculated in `lib/network.ts`, not hard-coded. Change
`companyNetworks` in `lib/mock-data.ts` and the flags update everywhere.

Demo highlight: a contractor (technician) logged in at **03:12 from an outside
IP** with MFA off and a 168h token.

All IPs come from documentation-only ranges (`192.0.2.x`, `198.51.100.x`,
`203.0.113.x`), and all emails use `.example` domains.

### AI Anomalies `/anomalies`
- Anomaly score chart per asset with the **0.6 cutoff** line
- One card per detection: suspected attack, severity, explanation, top features vs normal range, score bar
- Table of every model result, including normal ones

### Monitoring `/monitoring`
Telemetry for `fridge_01` during the attack window:
- Temperature with the normal 2–6°C band and the 8°C alert line
- Failed logins with the "more than 10 per minute" alert line
- Risk score with thresholds 30 / 60 / 100

### Incidents `/incidents`
Full timeline. Each event type has its own icon:

| Kind | Example | Produced by |
|---|---|---|
| INFO | User login | Backend |
| ATTACK | 15 failed logins | Backend rule engine |
| DETECTION | AI detected defrost flood | ML service |
| RESPONSE | Account locked, auto recovery | Backend response engine |
| RECOVERED | System healthy | ML (score back to normal) |

---

## 6. Data contracts

All types live in `frontend/lib/types.ts`. Backend and ML **must return these
exact shapes**.

### Shared enums

```ts
severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
attack:   "UNAUTH_DEFROST" | "DEFROST_FLOOD" | "SETPOINT_TAMPER" | "DEFAULT_CREDENTIALS"
        | "CREDENTIAL_STUFFING" | "PRIVILEGE_ESCALATION" | "MFA_DISABLED" | "KNOWN_CVE"
```

### Finding

```json
{
  "id": "f_001",
  "assetId": "fridge_01",
  "attack": "UNAUTH_DEFROST",
  "severity": "CRITICAL",
  "evidence": "POST /defrost returned 200 without token",
  "impactEur": 40000,
  "status": "OPEN",
  "recommendation": "Require an authenticated session on /defrost ...",
  "foundAt": "2026-10-29T09:02:00Z",
  "source": "REDTEAM"
}
```

CVE findings add `"source": "CVE"` and a `cve` object:

```json
"cve": {
  "id": "CVE-2021-44228",
  "cvss": 10.0,
  "product": "Apache Log4j",
  "version": "2.14.1",
  "fixedIn": "2.17.1",
  "publishedAt": "2021-12-10",
  "knownExploited": true,
  "url": "https://nvd.nist.gov/vuln/detail/CVE-2021-44228"
}
```

**`impactEur`** is the estimated money lost if a real attacker uses this hole:
`inventoryValue × spoilage chance + repair cost`. These are estimates; say so
in the pitch.

### ML anomaly result

```json
{
  "assetId": "fridge_01",
  "timestamp": "2026-10-29T09:15:00Z",
  "anomalyScore": 0.91,
  "isAnomaly": true,
  "severity": "CRITICAL",
  "suspectedAttack": "DEFROST_FLOOD",
  "topFeatures": [
    { "feature": "defrostCount1h", "value": 10, "normalRange": [0, 1] }
  ],
  "explanation": "10 defrost cycles in the last hour (normal: 0-1) while temperature is rising.",
  "model": "isolation_forest_v1"
}
```

| Score | Meaning |
|---|---|
| `anomalyScore` | 0 = normal, 1 = extremely unusual |
| `isAnomaly` | `true` when score ≥ 0.6 |
| `severity` | ≥ 0.8 CRITICAL · ≥ 0.6 HIGH · ≥ 0.4 MEDIUM · else LOW |

Note for the ML side: scikit-learn's `decision_function()` returns roughly
−0.5…0.5 (lower = more anomalous). Flip and scale it to 0–1 before returning.

### Other shapes

| Type | Key fields |
|---|---|
| `Asset` | `id, name, type, site, status, temperature?, inventoryValueEur, lastAudit` |
| `User` | `id, name, email, role, site, mfaEnabled, status, tokenLifetimeHours, lastLoginAt, lastLoginIp` |
| `LoginEvent` | `id, userId, timestamp, ip, location, success` |
| `CompanyNetwork` | `cidr, label` |
| `Incident` | `id, timestamp, assetId, kind, title, detail` |
| `TelemetryPoint` | `time, temperature, failedLogins, riskScore` |

---

## 7. Rules and thresholds

| Rule | Normal | Alert |
|---|---|---|
| Fridge temperature | 2–6°C | > 8°C |
| Failed logins | ≤ 3 per hour | > 10 per minute |
| Defrost | every 8 hours | > 3 per hour |
| Token lifetime | ≤ 24h | > 24h |
| Login IP | inside company ranges | outside → flagged |

Risk score = sum of active event weights (weak password 20, no MFA 25, failed
logins 15, temperature anomaly 30, unknown IP 20).

| Score | Level |
|---|---|
| 0–30 | SAFE |
| 31–60 | WARNING |
| 61–100 | HIGH |
| > 100 | CRITICAL |

---

## 8. Moving from mock to real data

Every page imports from `frontend/lib/mock-data.ts`. To go live, replace those
exports with API calls; **no page needs to change** as long as the shapes match.

| Data | Real source |
|---|---|
| Findings (Red Team) | NestJS `GET /findings` (filled by the Python agent via `POST /findings`) |
| Findings (CVE) | NestJS syncs `https://services.nvd.nist.gov/rest/json/cves/2.0?cpeName=<cpe>` and the CISA KEV JSON feed, then stores matches as findings |
| ML anomalies | NestJS calls ML `POST /predict`, then emits Socket.IO `ml:anomaly` |
| Telemetry, risk score | Socket.IO from the device simulator |
| Users, logins | NestJS + Postgres; check each login IP against `companyNetworks` |
| Incidents | Socket.IO events from the rule and response engines |

NVD allows about 5 requests per 30 seconds without an API key, so sync a few
times a day and cache the results.

---

## 9. Charts and colours

- Two-series charts use `--series-1` (gold) and `--series-2` (blue), defined in `globals.css` with separate light and dark values. Both were checked for colour-blind safety.
- Status colours (green / amber / red / blue) are only used for status, always with an icon and label.
- Thresholds are drawn as dashed reference lines on every chart.

---

## 10. Roadmap (final slide)

1. Rule engine ✅
2. Isolation Forest anomaly detection (in progress)
3. Digital twin of each device
4. AI Red Team agent (LLM chooses the next attack)
5. Multi-infrastructure defense platform (buildings, EV, transport, warehouses)

Business model: subscription per protected device.
