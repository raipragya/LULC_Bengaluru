import Link from "next/link"
import { ArrowRight, Brain, LineChart, Satellite } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { CityGrid } from "@/components/city-grid"
import { LulcLegend } from "@/components/lulc-legend"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-grid opacity-50"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, var(--primary), transparent 70%)",
          }}
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-start gap-8 px-4 pt-16 pb-12 sm:px-6 sm:pt-24 sm:pb-16">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
            <Satellite className="h-3 w-3 text-primary" aria-hidden />
            Deep learning spatial modeling · v0.1
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Urban land cover, decoded for the next{" "}
            <span className="text-primary">two decades</span>.
          </h1>

          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            A scientific-grade analytics surface for Indian metros — fusing 20 years of
            classified Landsat observations with a deep learning engine to project
            land use trajectories for 2035 and 2045.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href="/bangalore">
                Open Bangalore dashboard
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#cities">Browse cities</a>
            </Button>
          </div>

          <div className="mt-2">
            <LulcLegend />
          </div>
        </div>
      </section>

      {/* Capability strip */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-px bg-border sm:grid-cols-3">
          <Capability
            icon={<Satellite className="h-4 w-4" aria-hidden />}
            title="Multi-temporal classification"
            detail="2005 · 2015 · 2025 Landsat-derived LULC at 30 m resolution."
          />
          <Capability
            icon={<Brain className="h-4 w-4" aria-hidden />}
            title="Deep learning inference"
            detail="Advanced machine learning engine learns spatial drivers."
          />
          <Capability
            icon={<LineChart className="h-4 w-4" aria-hidden />}
            title="Forecast to 2045"
            detail="Projected developed, vegetation, wetland & water trajectories."
          />
        </div>
      </section>

      {/* Cities */}
      <section
        id="cities"
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20"
      >
        <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
              Coverage
            </span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Select a city
            </h2>
            <p className="mt-2 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              Bangalore is fully calibrated. Additional Indian metros are scheduled
              for upcoming model releases.
            </p>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            6 cities · 1 active
          </div>
        </header>

        <CityGrid />
      </section>

      {/* Methodology footnote */}
      <section
        id="methodology"
        className="border-t border-border bg-card/20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
                Methodology
              </span>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">
                How the engine works
              </h3>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground md:col-span-2">
              <p>
                Historical rasters are derived from Landsat 5/7/8 surface reflectance
                composites and classified using a supervised random-forest pipeline
                trained against ground-truth points and Dynamic World references.
              </p>
              <p>
                Future projections combine a Markov chain transition matrix with a
                deep learning model that learns spatial drivers — slope,
                proximity to roads, prior land use, and population density — to weight
                cell transition probabilities at each iteration.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <span>© {new Date().getFullYear()} Urban LULC Lab</span>
          <span className="font-mono text-[10px] uppercase tracking-wider">
            Built for spatial scientists
          </span>
        </div>
      </footer>
    </div>
  )
}

function Capability({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode
  title: string
  detail: string
}) {
  return (
    <div className="flex flex-col gap-2 bg-background p-6">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30">
        {icon}
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  )
}
