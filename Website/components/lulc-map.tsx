import Image from "next/image"
import { cn } from "@/lib/utils"

type LulcClass = "developed" | "vegetation" | "wetland" | "water"

const CLASS_COLOR: Record<LulcClass, string> = {
  developed: "var(--lulc-developed)",
  vegetation: "var(--lulc-vegetation)",
  wetland: "var(--lulc-wetland)",
  water: "var(--lulc-water)",
}

/**
 * Deterministic pseudo-random for stable SSR rendering.
 * Replace this component's <svg> with <Image src="/maps/blr-2025.png" /> later
 * to drop in real classified raster exports.
 */
function rand(x: number, y: number, seed = 0) {
  const v = Math.sin(x * 12.9898 + y * 78.233 + seed * 43.5453) * 43758.5453
  return v - Math.floor(v)
}

function classifyCell(
  x: number,
  y: number,
  size: number,
  yearProgress: number,
): LulcClass {
  const cx = size / 2 + 1
  const cy = size / 2 - 2
  const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
  const noise = rand(x, y) * 4.5
  const r = rand(x, y, 1)

  // Predetermined lake locations (Bangalore-style scattered tanks)
  const lakes: Array<[number, number, number]> = [
    [7, 22, 1.9],
    [24, 8, 1.6],
    [20, 25, 1.7],
    [6, 6, 1.4],
    [28, 18, 1.3],
    [14, 14, 1.1],
  ]

  let type: LulcClass = "vegetation"

  for (const [lx, ly, lr] of lakes) {
    const d = Math.sqrt((x - lx) ** 2 + (y - ly) ** 2)
    if (d < lr) {
      type = "water"
      break
    }
    if (d < lr + 1.2 && r < 0.6) {
      type = "wetland"
    }
  }

  // Urban radius grows with year
  const urbanRadius = 4 + yearProgress * 18
  if (dist + noise < urbanRadius) {
    type = "developed"
  }

  // Urban encroachment: water loss + wetland fragmentation in later years
  if (yearProgress > 0.45) {
    if (type === "water" && r < (yearProgress - 0.45) * 1.4) type = "developed"
    if (type === "wetland" && r < (yearProgress - 0.4) * 1.6) type = "developed"
  }

  // Scattered peripheral patches
  if (type === "vegetation" && yearProgress > 0.55 && rand(x, y, 2) < (yearProgress - 0.5) * 0.5) {
    type = "developed"
  }

  return type
}

export function LulcMap({
  year,
  className,
}: {
  year: number
  className?: string
}) {
  return (
    <div className={cn("relative w-full overflow-hidden rounded-lg", className)}>
      {/* The Next.js Image pointing to the moved files */}
        <Image
          src={`/maps/classified_${year}.png`}
          alt={`Land use classification for ${year}`}
          fill
          className="object-cover"
        />

      {/* Keep the overlays from your original code */}
      <div className="absolute left-3 top-3 glass rounded-md px-2.5 py-1 font-mono text-xs tracking-wider text-foreground">
        {year}
      </div>

      <div className="absolute right-3 top-3 glass flex h-7 w-7 items-center justify-center rounded-md font-mono text-[10px] font-semibold text-foreground">
        N
      </div>

      <div className="absolute bottom-3 left-3 glass rounded-md px-2 py-1">
        <div className="flex items-center gap-1.5">
          <div className="h-1 w-10 bg-foreground" />
          <span className="font-mono text-[10px] text-muted-foreground">10 km</span>
        </div>
      </div>
    </div>
  )
}
