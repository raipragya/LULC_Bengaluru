import { cn } from "@/lib/utils"

const CLASSES = [
  { key: "developed", label: "Developed", color: "bg-lulc-developed" },
  { key: "vegetation", label: "Vegetation", color: "bg-lulc-vegetation" },
  { key: "wetland", label: "Wetland", color: "bg-lulc-wetland" },
  { key: "water", label: "Water", color: "bg-lulc-water" },
] as const

export function LulcLegend({
  className,
  orientation = "horizontal",
}: {
  className?: string
  orientation?: "horizontal" | "vertical"
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-5 gap-y-2 text-xs",
        orientation === "vertical" && "flex-col items-start gap-y-2.5",
        className,
      )}
      role="list"
      aria-label="LULC classification legend"
    >
      {CLASSES.map((c) => (
        <div key={c.key} className="flex items-center gap-2" role="listitem">
          <span
            className={cn("h-3 w-3 rounded-[3px] ring-1 ring-foreground/10", c.color)}
            aria-hidden
          />
          <span className="font-medium text-foreground/90">{c.label}</span>
        </div>
      ))}
    </div>
  )
}
