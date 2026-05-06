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
  { year: 2005, developed: 10.68, vegetation: 41.85, wetland: 0.53, water: 46.94 },
  { year: 2010, developed: 12.23, vegetation: 41.69, wetland: 0.86, water: 45.22 },
  { year: 2015, developed: 13.78, vegetation: 41.53, wetland: 1.19, water: 43.50 },
  { year: 2020, developed: 18.84, vegetation: 40.22, wetland: 1.35, water: 39.59 },
  { year: 2025, developed: 23.90, vegetation: 38.91, wetland: 1.51, water: 35.68 },
]

const PROJECTED: DataPoint[] = [
  { year: 2030, developed: 26.94, vegetation: 36.56, wetland: 3.17, water: 33.33 },
  { year: 2035, developed: 29.97, vegetation: 34.21, wetland: 4.83, water: 30.98 },
  { year: 2040, developed: 31.14, vegetation: 33.18, wetland: 6.76, water: 28.93 },
  { year: 2045, developed: 32.30, vegetation: 32.15, wetland: 8.68, water: 26.87 },
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
            domain={[0, 50]}
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
            formatter={(value, name) => {
              const val = typeof value === "number" ? value : 0
              const strName = typeof name === "string" ? name : String(name || "")
              return [
                `${val}%`,
                strName ? strName.charAt(0).toUpperCase() + strName.slice(1) : "",
              ]
            }}
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
