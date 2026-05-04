import Link from "next/link"
import { ChevronLeft, MapPin } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { HistoricalAnalysis } from "@/components/historical-analysis"
import { FuturePrediction } from "@/components/future-prediction"

export default function BangalorePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Page hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-grid opacity-40"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -top-32 right-1/2 h-[360px] w-[640px] translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, var(--primary), transparent 70%)",
          }}
          aria-hidden
        />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
            All cities
          </Link>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <MapPin className="h-3 w-3 text-primary" aria-hidden />
                Bangalore · Karnataka · India
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Bangalore LULC Dashboard
              </h1>
              <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                Two decades of classified observations, paired with a CA-ANN projection
                engine — explore Bangalore&apos;s urban transformation and what comes
                next.
              </p>
            </div>

            <dl className="grid grid-cols-3 gap-6 rounded-lg border border-border bg-card/60 p-4 backdrop-blur">
              <Stat label="Coords" value="12.97° N" />
              <Stat label="Area" value="741 km²" />
              <Stat label="Resolution" value="30 m" />
            </dl>
          </div>
        </div>
      </section>

      <HistoricalAnalysis />
      <div className="border-t border-border" />
      <FuturePrediction />

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <span>© {new Date().getFullYear()} Urban LULC Lab</span>
          <span className="font-mono text-[10px] uppercase tracking-wider">
            CA-ANN · Bangalore release
          </span>
        </div>
      </footer>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="font-mono text-sm text-foreground">{value}</dd>
    </div>
  )
}
