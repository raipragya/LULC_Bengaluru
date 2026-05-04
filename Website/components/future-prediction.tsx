"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Cpu,
  Download,
  Droplets,
  Sparkles,
  Thermometer,
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
          Run a Cellular Automata-Artificial Neural Network (CA-ANN) simulation calibrated
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
          CA-ANN · Bangalore · 30 m
        </div>

        <h3 className="max-w-xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          Generate Future LULC Report (2035 &amp; 2045)
        </h3>
        <p className="max-w-md text-sm text-pretty text-muted-foreground">
          Simulate two decades of urban transition based on calibrated transition
          probabilities and ANN-learned spatial drivers.
        </p>

        <Button size="lg" onClick={onRun} className="gap-2">
          <Sparkles className="h-4 w-4" aria-hidden />
          Run CA-ANN Simulation
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
                CA-ANN
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

          <div className="grid grid-cols-1 gap-2.5">
            <Risk
              icon={<TreePine className="h-4 w-4" aria-hidden />}
              tone="vegetation"
              title="Vegetation collapse"
              detail="Secondary corridors fully consumed by 2035."
            />
            <Risk
              icon={<Droplets className="h-4 w-4" aria-hidden />}
              tone="water"
              title="Minor lake loss"
              detail="Near-total loss of localized minor water bodies."
            />
            <Risk
              icon={<Thermometer className="h-4 w-4" aria-hidden />}
              tone="developed"
              title="Micro-climate warming"
              detail="UHI intensification across core metropolitan grid."
            />
            <Risk
              icon={<AlertTriangle className="h-4 w-4" aria-hidden />}
              tone="wetland"
              title="Wetland encroachment"
              detail="Vulnerable wetland zones absorbed by 2045."
            />
          </div>

          <p className="text-sm text-pretty leading-relaxed text-muted-foreground">
            Based on our Cellular Automata-Artificial Neural Network (CA-ANN) spatial
            modeling, the trajectory for 2035 and 2045 indicates a critical shift in
            Bangalore&apos;s landscape. If current transition probabilities hold, the
            &quot;Developed&quot; footprint will dominate the metropolitan boundary by
            2035, engulfing the remaining secondary vegetation corridors. By 2045, the
            model predicts that core urban density will force expansion into previously
            vulnerable wetland zones. The simulation suggests a near-total loss of
            localized minor water bodies, consolidating only major lakes. This projected
            LULC transition strongly indicates that without immediate policy intervention,
            Bangalore will face severe micro-climate warming and acute water stress by
            the mid-2040s.
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
