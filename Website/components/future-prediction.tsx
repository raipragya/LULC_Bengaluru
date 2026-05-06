"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Cpu,
  Download,
  Droplets,
  Sparkles,
  Thermometer,
  TrendingDown,
  TrendingUp,
  TreePine,
} from "lucide-react"
import { LulcMap } from "@/components/lulc-map"
import { LulcLegend } from "@/components/lulc-legend"
import { LulcChart } from "@/components/lulc-chart"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type Status = "idle" | "loading" | "ready"

const STAGES = [
  "Loading transition probability matrix",
  "Initializing CA-ANN cellular grid",
  "Training neural net (8 hidden layers)",
  "Iterating Markov chain · t+10y",
  "Iterating Markov chain · t+20y",
  "Composing classified raster",
] as const

export function FuturePrediction() {
  const [status, setStatus] = useState<Status>("idle")
  const [stage, setStage] = useState<number>(0)

  const run = () => {
    setStatus("loading")
    setStage(0)
    let i = 0
    const id = setInterval(() => {
      i += 1
      if (i >= STAGES.length) {
        clearInterval(id)
        setStatus("ready")
      } else {
        setStage(i)
      }
    }, 650)
  }

  return (
    <section
      id="future"
      className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <header className="mb-8 flex max-w-2xl flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
          02 · Future Projection
        </span>
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Projected Urban Sprawl &amp; Environmental Forecast
        </h2>
        <p className="text-pretty leading-relaxed text-muted-foreground">
          Run a deep learning spatial simulation calibrated
          on the 2005–2025 transition matrix to project Bangalore&apos;s LULC for the
          decades ahead.
        </p>
      </header>

      {status === "idle" && <IdleCard onRun={run} />}
      {status === "loading" && <LoadingCard stage={stage} />}
      {status === "ready" && <ReadyView />}
    </section>
  )
}

function IdleCard({ onRun }: { onRun: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/50 to-card" aria-hidden />

      <div className="relative flex flex-col items-center gap-6 px-6 py-16 text-center sm:py-20">
        <div className="flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
          <Cpu className="h-3 w-3 text-primary" aria-hidden />
          Deep Learning · Bangalore · 30 m
        </div>

        <h3 className="max-w-xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          Generate Future LULC Report (2035 &amp; 2045)
        </h3>
        <p className="max-w-md text-sm text-pretty text-muted-foreground">
          Simulate two decades of urban transition based on calibrated transition
          probabilities and machine-learning-inferred spatial drivers.
        </p>

        <Button size="lg" onClick={onRun} className="gap-2">
          <Sparkles className="h-4 w-4" aria-hidden />
          Run Prediction Simulation
        </Button>

        <dl className="mt-2 grid grid-cols-3 gap-6 text-left">
          <Spec label="Cell size" value="30 m" />
          <Spec label="Iterations" value="20" />
          <Spec label="Horizon" value="2045" />
        </dl>
      </div>
    </div>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="font-mono text-sm text-foreground">{value}</dd>
    </div>
  )
}

function LoadingCard({ stage }: { stage: number }) {
  const progress = Math.min(100, ((stage + 1) / STAGES.length) * 100)

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <Skeleton className="aspect-[5/4] w-full rounded-xl" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="aspect-[5/4] w-full rounded-xl" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-foreground">
            <Spinner className="h-4 w-4 text-primary" />
            <span>{STAGES[stage]}…</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ul className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {STAGES.map((s, i) => (
            <li
              key={s}
              className={cn(
                "flex items-center gap-2 font-mono text-xs",
                i < stage
                  ? "text-foreground/80"
                  : i === stage
                    ? "text-primary"
                    : "text-muted-foreground/50",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  i < stage
                    ? "bg-primary/60"
                    : i === stage
                      ? "animate-pulse bg-primary"
                      : "bg-muted-foreground/30",
                )}
              />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ReadyView() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[2035, 2045].map((year) => (
          <figure
            key={year}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="aspect-[5/4] w-full">
              <LulcMap year={year} className="h-full w-full" />
            </div>
            <figcaption className="flex items-center justify-between border-t border-border p-4">
              <div>
                <div className="font-mono text-xs text-muted-foreground">
                  Projection · t+{year - 2025}y
                </div>
                <div className="text-base font-semibold">{year}</div>
              </div>
              <span className="rounded-md bg-primary/15 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-primary ring-1 ring-primary/30">
                XGBoost
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <LulcLegend />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <article className="rounded-xl border border-border bg-card p-6 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold">
              Historical &amp; projected class share
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              2005 → 2045
            </span>
          </div>
          <LulcChart includeProjection />
        </article>

        <article className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Forecast Report</h3>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" aria-hidden />
              Export
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ForecastStat label="Built-up (2025→2045)" value="+8.40" hint="pp" trend="up" tone="developed" />
            <ForecastStat label="Water (2025→2045)" value="−8.81" hint="pp" trend="down" tone="water" />
            <ForecastStat label="Vegetation (2025→2045)" value="−6.76" hint="pp" trend="down" tone="vegetation" />
            <ForecastStat label="Bare Land (2025→2045)" value="+7.16" hint="pp" trend="up" tone="wetland" />
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            <Risk
              icon={<Thermometer className="h-4 w-4" aria-hidden />}
              tone="developed"
              title="Built-up: 23.90% → 32.30%"
              detail="Urban expansion continues (+6.08 pp by 2035, +2.32 pp by 2045)."
            />
            <Risk
              icon={<TreePine className="h-4 w-4" aria-hidden />}
              tone="vegetation"
              title="Vegetation: 38.91% → 32.15%"
              detail="Steady green cover loss of 6.76 pp over 20 years."
            />
            <Risk
              icon={<AlertTriangle className="h-4 w-4" aria-hidden />}
              tone="wetland"
              title="Bare Land: 1.51% → 8.68%"
              detail="5.7× surge — active land clearing outpacing construction."
            />
            <Risk
              icon={<Droplets className="h-4 w-4" aria-hidden />}
              tone="water"
              title="Water: 35.68% → 26.87%"
              detail="Largest loss (−8.81 pp) — wetland/lake encroachment intensifies."
            />
          </div>

          <p className="text-sm text-pretty leading-relaxed text-muted-foreground">
            The XGBoost model projects built-up area growing from 23.90% to 32.30%
            by 2045, with water bodies suffering the steepest decline (−8.81 pp).
            Bare land surges 5.7× indicating active peri-urban clearing. The
            2025–2035 decade is a critical intervention window before these
            changes become irreversible.
          </p>
        </article>
      </div>
    </div>
  )
}

function Risk({
  icon,
  tone,
  title,
  detail,
}: {
  icon: React.ReactNode
  tone: "developed" | "vegetation" | "water" | "wetland"
  title: string
  detail: string
}) {
  const toneBg = {
    developed: "bg-lulc-developed/12 text-lulc-developed ring-lulc-developed/30",
    vegetation: "bg-lulc-vegetation/12 text-lulc-vegetation ring-lulc-vegetation/30",
    water: "bg-lulc-water/12 text-lulc-water ring-lulc-water/30",
    wetland: "bg-lulc-wetland/12 text-lulc-wetland ring-lulc-wetland/30",
  }[tone]

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-background/40 p-3">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md ring-1",
          toneBg,
        )}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">{detail}</span>
      </div>
    </div>
  )
}

function ForecastStat({
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
