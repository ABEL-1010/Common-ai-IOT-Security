"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts"

import type { MlAnomaly, TelemetryPoint } from "@/lib/types"
import { formatTime } from "@/lib/format"

const AXIS = {
  stroke: "var(--muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
} as const

const GRID = (
  <CartesianGrid
    vertical={false}
    stroke="var(--border)"
    strokeDasharray="3 3"
  />
)

function ChartTooltip({
  active,
  payload,
  label,
  unit = "",
}: Partial<TooltipContentProps<number, string>> & { unit?: string }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-xl border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
      <div className="mb-1 font-medium">{label}</div>
      {payload.map((item) => (
        <div key={String(item.dataKey)} className="flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{ background: item.color }}
          />
          <span className="text-muted-foreground">{item.name}</span>
          <span className="ml-auto font-medium tabular-nums">
            {item.value}
            {unit}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Risk score with the spec thresholds (30 / 60 / 100) as reference lines. */
export function RiskScoreChart({ data }: { data: TelemetryPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16 }}>
        <defs>
          <linearGradient id="risk-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--series-1)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--series-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        {GRID}
        <XAxis dataKey="time" {...AXIS} />
        <YAxis domain={[0, 120]} {...AXIS} />
        <ReferenceLine y={30} stroke="var(--border)" label={{ value: "Warning", position: "insideTopLeft", fontSize: 11, fill: "var(--muted-foreground)" }} />
        <ReferenceLine y={60} stroke="var(--border)" label={{ value: "High", position: "insideTopLeft", fontSize: 11, fill: "var(--muted-foreground)" }} />
        <ReferenceLine y={100} stroke="var(--destructive)" strokeDasharray="4 4" label={{ value: "Critical", position: "insideTopLeft", fontSize: 11, fill: "var(--destructive)" }} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "3 3" }} />
        <Area
          type="monotone"
          dataKey="riskScore"
          name="Risk score"
          stroke="var(--series-1)"
          strokeWidth={2}
          fill="url(#risk-fill)"
          activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--card)" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/** Temperature with the normal 2–6 °C band shaded. */
export function TemperatureChart({ data }: { data: TelemetryPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16 }}>
        {GRID}
        <XAxis dataKey="time" {...AXIS} />
        <YAxis {...AXIS} unit="°" />
        <ReferenceArea y1={2} y2={6} fill="var(--muted-foreground)" fillOpacity={0.08} label={{ value: "Normal 2–6 °C", position: "insideTopLeft", fontSize: 11, fill: "var(--muted-foreground)" }} />
        <ReferenceLine y={8} stroke="var(--destructive)" strokeDasharray="4 4" label={{ value: "Alert > 8 °C", position: "insideTopRight", fontSize: 11, fill: "var(--destructive)" }} />
        <Tooltip content={<ChartTooltip unit=" °C" />} cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "3 3" }} />
        <Line
          type="monotone"
          dataKey="temperature"
          name="Temperature"
          stroke="var(--series-1)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--card)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function FailedLoginsChart({ data }: { data: TelemetryPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16 }}>
        {GRID}
        <XAxis dataKey="time" {...AXIS} />
        <YAxis allowDecimals={false} {...AXIS} />
        <ReferenceLine y={10} stroke="var(--destructive)" strokeDasharray="4 4" label={{ value: "Alert > 10 / min", position: "insideTopRight", fontSize: 11, fill: "var(--destructive)" }} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.6 }} />
        <Bar
          dataKey="failedLogins"
          name="Failed logins"
          fill="var(--series-1)"
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

const ASSET_COLORS = ["var(--series-1)", "var(--series-2)"]

/**
 * ML anomaly score over time, one line per asset, with the 0.6 anomaly
 * cutoff from the ML contract. Colors follow the asset, not its rank.
 */
export function AnomalyScoreChart({ anomalies }: { anomalies: MlAnomaly[] }) {
  const assetIds = [...new Set(anomalies.map((a) => a.assetId))].sort()
  const byTime = new Map<string, Record<string, number | string>>()

  for (const a of anomalies) {
    const key = formatTime(a.timestamp) + ":" + a.timestamp.slice(17, 19)
    const row = byTime.get(key) ?? { time: key }
    row[a.assetId] = a.anomalyScore
    byTime.set(key, row)
  }
  const data = [...byTime.values()]

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16 }}>
        {GRID}
        <XAxis dataKey="time" {...AXIS} />
        <YAxis domain={[0, 1]} ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]} {...AXIS} />
        <ReferenceLine y={0.6} stroke="var(--destructive)" strokeDasharray="4 4" label={{ value: "Anomaly ≥ 0.6", position: "insideTopLeft", fontSize: 11, fill: "var(--destructive)" }} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "3 3" }} />
        <Legend
          verticalAlign="top"
          align="right"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: "var(--muted-foreground)" }}
        />
        {assetIds.map((id, index) => (
          <Line
            key={id}
            type="monotone"
            dataKey={id}
            name={id}
            stroke={ASSET_COLORS[index % ASSET_COLORS.length]}
            strokeWidth={2}
            connectNulls
            dot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: "var(--card)" }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
