"use client"

import { useState } from "react"
import { ArrowLeftRight, TrendingDown, TrendingUp } from "lucide-react"
import { LulcMap } from "@/components/lulc-map"
import { LulcLegend } from "@/components/lulc-legend"
import { LulcChart } from "@/components/lulc-chart"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const YEARS = [2005, 2015, 2025] as const

export function HistoricalAnalysis() {
  const [view, setView] = useState<"grid" | "compare">("grid")
  const [leftYear, setLeftYear] = useState<number>(2005)
  const [rightYear, setRightYear] = useState<number>(2025)
  const [sliderPos, setSliderPos] = useState<number>(50)

  return (
    <section
      id="historical"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20"
    >
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-2xl flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            01 · Historical Analysis
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Rapid Urbanization and Ecological Shift
          </h2>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Two decades of classified Landsat-derived LULC observations for the Bangalore
            metropolitan boundary, comparing 2005, 2015, and 2025.
          </p>
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "compare")}>
          <TabsList>
            <TabsTrigger value="grid">Timeline</TabsTrigger>
            <TabsTrigger value="compare" className="gap-1.5">
              <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden />
              Compare
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {YEARS.map((year, i) => (
            <figure
              key={year}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="aspect-[5/4] w-full">
                <LulcMap year={year} className="h-full w-full" />
              </div>
              <figcaption className="flex items-center justify-between border-t border-border p-4">
                <div>
                  <div className="font-mono text-xs text-muted-foreground">
                    Epoch {i + 1}
                  </div>
                  <div className="text-base font-semibold">{year}</div>
                </div>
                <span className="rounded-md bg-muted px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Landsat · 30 m
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <CompareView
          leftYear={leftYear}
          rightYear={rightYear}
          sliderPos={sliderPos}
          onLeftChange={setLeftYear}
          onRightChange={setRightYear}
          onSliderChange={setSliderPos}
        />
      )}

      <div className="mt-8">
        <LulcLegend />
      </div>

      {/* Chart + analysis */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <article className="rounded-xl border border-border bg-card p-6 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold">Class share over time</h3>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              % of metropolitan area
            </span>
          </div>
          <LulcChart />
        </article>

        <article className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 leading-relaxed lg:col-span-2">
          <h3 className="text-base font-semibold">Key Findings</h3>

          <div className="grid grid-cols-2 gap-3">
            <Stat
              label="Developed (2015–2025)"
              value="+7.3%"
              hint="annual"
              trend="up"
              tone="developed"
            />
            <Stat
              label="Water bodies"
              value="−1.8%"
              hint="annual"
              trend="down"
              tone="water"
            />
            <Stat
              label="Developed (2005–2015)"
              value="+2.9%"
              hint="annual"
              trend="up"
              tone="developed"
            />
            <Stat
              label="Vegetation"
              value="−4.6%"
              hint="annual"
              trend="down"
              tone="vegetation"
            />
          </div>

          <p className="text-sm text-pretty text-muted-foreground">
            Between 2005 and 2025, Bangalore experienced an unprecedented wave of urban
            expansion. In the first decade (2005–2015), the &quot;Developed&quot; land use
            class grew at a steady rate of 2.9% per year, primarily consuming peripheral
            vegetation. However, the subsequent decade (2015–2025) witnessed an explosive
            acceleration, with the developed area expanding at an alarming 7.3% annually.
            This unchecked growth has come at a severe ecological cost: natural water
            bodies saw an accelerated depletion, losing 1.8% of their area annually, while
            vital wetland ecosystems were significantly fragmented — contributing directly
            to the city&apos;s increasing urban heat island (UHI) effect.
          </p>
        </article>
      </div>
    </section>
  )
}

function Stat({
  label,
  value,
  hint,
  trend,
  tone,
}: {
  label: string
  value: string
  hint?: string
  trend: "up" | "down"
  tone: "developed" | "vegetation" | "water" | "wetland"
}) {
  const Icon = trend === "up" ? TrendingUp : TrendingDown
  const toneClass = {
    developed: "text-lulc-developed",
    vegetation: "text-lulc-vegetation",
    wetland: "text-lulc-wetland",
    water: "text-lulc-water",
  }[tone]

  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span>{label}</span>
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className={cn("font-mono text-xl font-semibold tracking-tight", toneClass)}>
          {value}
        </span>
        {hint && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {hint}
          </span>
        )}
        <Icon className={cn("ml-auto h-3.5 w-3.5", toneClass)} aria-hidden />
      </div>
    </div>
  )
}

function CompareView({
  leftYear,
  rightYear,
  sliderPos,
  onLeftChange,
  onRightChange,
  onSliderChange,
}: {
  leftYear: number
  rightYear: number
  sliderPos: number
  onLeftChange: (y: number) => void
  onRightChange: (y: number) => void
  onSliderChange: (n: number) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-card">
        {/* Right (newer) layer */}
        <LulcMap year={rightYear} className="absolute inset-0 h-full w-full" />

        {/* Left (older) layer clipped by slider */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <LulcMap year={leftYear} className="h-full w-full" />
        </div>

        {/* Year labels */}
        <div className="absolute left-4 top-4 glass rounded-md px-2.5 py-1 font-mono text-xs">
          {leftYear}
        </div>
        <div className="absolute right-4 top-4 glass rounded-md px-2.5 py-1 font-mono text-xs">
          {rightYear}
        </div>

        {/* Slider line + handle */}
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-foreground/70 shadow-[0_0_18px_2px_var(--primary)]"
          style={{ left: `${sliderPos}%` }}
        />
        <div
          className="pointer-events-none absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 backdrop-blur"
          style={{ left: `${sliderPos}%` }}
        >
          <ArrowLeftRight className="h-4 w-4 text-primary" aria-hidden />
        </div>

        {/* Range input overlaying the map */}
        <input
          type="range"
          min={0}
          max={100}
          value={sliderPos}
          onChange={(e) => onSliderChange(Number(e.target.value))}
          aria-label="Compare years slider"
          className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
        />
      </div>

      <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-border bg-card/60 p-3 sm:flex-row">
        <YearPicker label="Left" value={leftYear} onChange={onLeftChange} />
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Drag to compare
        </span>
        <YearPicker label="Right" value={rightYear} onChange={onRightChange} />
      </div>
    </div>
  )
}

function YearPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (y: number) => void
}) {
  const options = [2005, 2010, 2015, 2020, 2025]
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex overflow-hidden rounded-md border border-border">
        {options.map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => onChange(y)}
            className={cn(
              "px-2.5 py-1 font-mono text-xs transition-colors",
              value === y
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  )
}
