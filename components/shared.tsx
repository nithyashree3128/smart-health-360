import { Heart, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export function Logo({
  size = 40,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative grid place-items-center rounded-sm bg-primary text-primary-foreground",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Heart className="h-1/2 w-1/2" strokeWidth={2.4} />
      <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-sm bg-signal-amber text-background ring-2 ring-background">
        <Plus className="h-3 w-3" strokeWidth={3.5} />
      </span>
    </div>
  )
}

/** Section heading: tracked mono eyebrow + title, command-board register. */
export function SectionHeading({
  title,
  icon: Icon,
  action,
  eyebrow,
}: {
  title: string
  icon?: React.ComponentType<{ className?: string }>
  action?: React.ReactNode
  eyebrow?: string
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
      <div className="min-w-0">
        {eyebrow && (
          <p className="eyebrow mb-1 text-muted-foreground">{eyebrow}</p>
        )}
        <h2 className="flex items-center gap-2 text-pretty text-sm font-semibold tracking-wide text-foreground">
          {Icon ? <Icon className="h-4 w-4 text-primary" /> : null}
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "rounded-md border border-border bg-card p-5",
        className,
      )}
    >
      {children}
    </section>
  )
}

type Tone = "green" | "amber" | "red" | "slate" | "blue"

const toneMap: Record<Tone, string> = {
  green: "bg-primary/10 text-primary ring-primary/25",
  amber: "bg-signal-amber/10 text-signal-amber ring-signal-amber/25",
  red: "bg-signal-red/10 text-signal-red ring-signal-red/25",
  slate: "bg-secondary text-muted-foreground ring-border",
  blue: "bg-signal-blue/10 text-signal-blue ring-signal-blue/25",
}

const ledMap: Record<Tone, string> = {
  green: "led-green",
  amber: "led-amber",
  red: "led-red",
  slate: "",
  blue: "led-green",
}

/** Status pill with an LED dot — the base unit of the ops-board vocabulary. */
export function Badge({
  children,
  tone = "slate",
  className,
  pulse,
  dot = true,
}: {
  children: React.ReactNode
  tone?: Tone
  className?: string
  pulse?: boolean
  dot?: boolean
}) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center gap-1.5 rounded-sm px-2 py-1 ring-1 ring-inset",
        toneMap[tone],
        pulse && "animate-flash-alert",
        className,
      )}
    >
      {dot && tone !== "slate" && <span className={cn("led", ledMap[tone])} />}
      {children}
    </span>
  )
}

export function StockBar({ pct }: { pct: number }) {
  const tone =
    pct < 20 ? "bg-signal-red" : pct < 50 ? "bg-signal-amber" : "bg-primary"
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-full max-w-[140px] overflow-hidden rounded-sm bg-secondary">
        <div
          className={cn("h-full rounded-sm transition-all", tone)}
          style={{ width: `${Math.max(pct, 4)}%` }}
        />
      </div>
      <span
        className={cn(
          "tabular w-10 shrink-0 text-right text-xs font-semibold",
          pct < 20 ? "text-signal-red" : "text-muted-foreground",
        )}
      >
        {pct}%
      </span>
    </div>
  )
}
