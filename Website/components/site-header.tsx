import Link from "next/link"
import { Satellite, Github } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30">
            <Satellite className="h-4 w-4 text-primary" aria-hidden />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">Urban LULC</span>
            <span className="font-mono text-[10px] text-muted-foreground">
              CA-ANN · v0.1
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          <Link href="/" className="transition-colors hover:text-foreground">
            Cities
          </Link>
          <Link
            href="/bangalore"
            className="transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <a
            href="#methodology"
            className="transition-colors hover:text-foreground"
          >
            Methodology
          </a>
        </nav>

        <Button variant="ghost" size="sm" asChild className="gap-1.5">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
          >
            <Github className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Source</span>
          </a>
        </Button>
      </div>
    </header>
  )
}
