"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type DataPoint = {
  year: number
  developed: number
  vegetation: number
  wetland: number
  water: number
}

const HISTORICAL: DataPoint[] = [
  { year: 2005, developed: 18, vegetation: 58, wetland: 9, water: 15 },
  { year: 2010, developed: 23, vegetation: 53, wetland: 8, water: 16 },
  { year: 2015, developed: 30, vegetation: 47, wetland: 8, water: 15 },
  { year: 2020, developed: 42, vegetation: 38, wetland: 7, water: 13 },
  { year: 2025, developed: 54, vegetation: 30, wetland: 6, water: 10 },
]

const PROJECTED: DataPoint[] = [
  { year: 2030, developed: 64, vegetation: 24, wetland: 5, water: 7 },
  { year: 2035, developed: 71, vegetation: 19, wetland: 4, water: 6 },
  { year: 2040, developed: 76, vegetation: 15, wetland: 4, water: 5 },
  { year: 2045, developed: 80, vegetation: 12, wetland: 4, water: 4 },
]

const FULL = [...HISTORICAL, ...PROJECTED]

export function LulcChart({
  includeProjection = false,
}: {
  includeProjection?: boolean
}) {
  const data = includeProjection ? FULL : HISTORICAL

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="g-developed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--lulc-developed)" stopOpacity={0.55} />
              <stop offset="100%" stopColor="var(--lulc-developed)" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="g-vegetation" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--lulc-vegetation)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="var(--lulc-vegetation)" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="g-wetland" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--lulc-wetland)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="var(--lulc-wetland)" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="g-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--lulc-water)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="var(--lulc-water)" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="year"
            stroke="var(--muted-foreground)"
            tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
          />
          <Tooltip
            cursor={{ stroke: "var(--primary)", strokeOpacity: 0.4, strokeDasharray: "3 3" }}
            contentStyle={{
              backgroundColor: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
              padding: "8px 10px",
            }}
            labelStyle={{
              color: "var(--muted-foreground)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              marginBottom: 4,
            }}
            formatter={(value: number, name: string) => [
              `${value}%`,
              name.charAt(0).toUpperCase() + name.slice(1),
            ]}
          />

          <Area
            type="monotone"
            dataKey="developed"
            stroke="var(--lulc-developed)"
            strokeWidth={2}
            fill="url(#g-developed)"
            stackId={undefined}
          />
          <Area
            type="monotone"
            dataKey="vegetation"
            stroke="var(--lulc-vegetation)"
            strokeWidth={2}
            fill="url(#g-vegetation)"
          />
          <Area
            type="monotone"
            dataKey="wetland"
            stroke="var(--lulc-wetland)"
            strokeWidth={2}
            fill="url(#g-wetland)"
          />
          <Area
            type="monotone"
            dataKey="water"
            stroke="var(--lulc-water)"
            strokeWidth={2}
            fill="url(#g-water)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
