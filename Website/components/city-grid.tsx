import Link from "next/link"
import { ArrowUpRight, Lock, MapPin } from "lucide-react"
import { LulcMap } from "@/components/lulc-map"
import { cn } from "@/lib/utils"

type City = {
  slug: string
  name: string
  state: string
  coords: string
  active: boolean
  /** approximate "current year" thumbnail for the active card */
  previewYear?: number
}

const CITIES: City[] = [
  {
    slug: "bangalore",
    name: "Bangalore",
    state: "Karnataka",
    coords: "12.97° N · 77.59° E",
    active: true,
    previewYear: 2025,
  },
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra", coords: "19.07° N · 72.87° E", active: false },
  { slug: "delhi", name: "Delhi", state: "NCT", coords: "28.61° N · 77.23° E", active: false },
  { slug: "chennai", name: "Chennai", state: "Tamil Nadu", coords: "13.08° N · 80.27° E", active: false },
  { slug: "hyderabad", name: "Hyderabad", state: "Telangana", coords: "17.38° N · 78.48° E", active: false },
  { slug: "kolkata", name: "Kolkata", state: "West Bengal", coords: "22.57° N · 88.36° E", active: false },
]

export function CityGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CITIES.map((city) => (
        <CityCard key={city.slug} city={city} />
      ))}
    </div>
  )
}

function CityCard({ city }: { city: City }) {
  const Wrapper = city.active ? Link : "div"
  const wrapperProps = city.active ? { href: `/${city.slug}` } : {}

  return (
    <Wrapper
      {...(wrapperProps as { href: string })}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all",
        city.active
          ? "cursor-pointer hover:border-primary/50 hover:shadow-[0_0_0_1px_var(--primary)] focus-visible:outline-2 focus-visible:outline-primary"
          : "cursor-not-allowed opacity-70",
      )}
      aria-disabled={!city.active}
      aria-label={
        city.active
          ? `Open ${city.name} dashboard`
          : `${city.name} — coming soon`
      }
    >
      <div className="relative aspect-[5/3] w-full">
        {city.active ? (
          <LulcMap year={city.previewYear ?? 2025} className="h-full w-full" />
        ) : (
          <div className="absolute inset-0 bg-grid">
            <div className="absolute inset-0 bg-gradient-to-br from-background/30 via-background/60 to-background" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <Lock className="h-3 w-3" aria-hidden />
                Coming soon
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-3 p-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight">{city.name}</h3>
            {city.active && (
              <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">{city.state}</p>
          <p className="mt-1 flex items-center gap-1 font-mono text-[10px] text-muted-foreground/80">
            <MapPin className="h-3 w-3" aria-hidden />
            {city.coords}
          </p>
        </div>

        {city.active ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </div>
        ) : (
          <span className="rounded-md bg-muted px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Q3 · 26
          </span>
        )}
      </div>
    </Wrapper>
  )
}
