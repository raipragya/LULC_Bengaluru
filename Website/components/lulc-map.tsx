import Image from "next/image"
import { cn } from "@/lib/utils"

export function LulcMap({
  year,
  className,
}: {
  year: number
  className?: string
}) {
  return (
    <div className={cn("relative w-full overflow-hidden rounded-lg bg-muted/20 min-h-[200px]", className)}>
      <Image
        src={`/maps/classified_${year}.png`}
        alt={`Land use classification for ${year}`}
        fill
        className="object-cover"
        unoptimized
      />

      {/* Year tag overlay */}
      <div className="absolute left-3 top-3 glass rounded-md px-2.5 py-1 font-mono text-xs tracking-wider text-foreground">
        {year}
      </div>

      {/* North arrow */}
      <div className="absolute right-3 top-3 glass flex h-7 w-7 items-center justify-center rounded-md font-mono text-[10px] font-semibold text-foreground">
        N
      </div>

      {/* Scale bar */}
      <div className="absolute bottom-3 left-3 glass rounded-md px-2 py-1">
        <div className="flex items-center gap-1.5">
          <div className="h-1 w-10 bg-foreground" />
          <span className="font-mono text-[10px] text-muted-foreground">10 km</span>
        </div>
      </div>
    </div>
  )
}
