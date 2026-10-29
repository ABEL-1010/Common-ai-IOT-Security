import * as React from "react";

import { cn } from "@/lib/utils";

interface SparklineProps extends React.SVGProps<SVGSVGElement> {
  data: number[];
  width?: number;
  height?: number;
  /** Render a soft gradient area under the line. */
  area?: boolean;
  strokeWidth?: number;
}

/**
 * Lightweight, dependency-free sparkline that works in Server Components
 * (no hooks). Uses `currentColor` so callers can tint it with any text-color
 * utility (e.g. text-chart-2 / text-emerald-500).
 */
export function Sparkline({
  data,
  width = 120,
  height = 40,
  area = true,
  strokeWidth = 2,
  className,
  ...props
}: SparklineProps) {
  // Deterministic, SSR-safe gradient id. Identical series share a gradient,
  // which is harmless since the gradient definition is the same.
  const gradientId = `spark-${data.length}-${Math.round(
    data.reduce((sum, n) => sum + n, 0)
  )}`;

  let line: string;
  let fill = "";

  if (data.length < 2) {
    const y = height / 2;
    line = `M0 ${y} L${width} ${y}`;
  } else {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const step = width / (data.length - 1);
    const pad = strokeWidth;

    const points = data.map((value, index) => {
      const x = index * step;
      const y = height - pad - ((value - min) / span) * (height - pad * 2);
      return [x, y] as const;
    });

    line = points
      .map(
        ([x, y], i) =>
          `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`
      )
      .join(" ");
    fill = `${line} L${width} ${height} L0 ${height} Z`;
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      fill="none"
      preserveAspectRatio="none"
      className={cn("overflow-visible", className)}
      {...props}
    >
      {area && fill ? (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={fill} fill={`url(#${gradientId})`} />
        </>
      ) : null}
      <path
        d={line}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
