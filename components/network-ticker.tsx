import { macroMetrics, outbreaks, inventory, grievances } from "@/lib/mock-data"

type TickerItem = { tag: string; text: string; tone: "green" | "amber" | "red" }

function buildFeed(): TickerItem[] {
  const items: TickerItem[] = []

  for (const m of macroMetrics) {
    items.push({
      tag: "NETWORK",
      text: `${m.label} — ${m.value} (${m.sub})`,
      tone: m.status === "alert" ? "red" : m.status === "watch" ? "amber" : "green",
    })
  }
  for (const o of outbreaks) {
    items.push({
      tag: "OUTBREAK",
      text: `${o.disease} — ${o.cases} cases ${o.change} · ${o.region}`,
      tone: o.level === "alert" ? "red" : "amber",
    })
  }
  const lowStock = inventory.filter((i) => i.stockPct < 20)
  for (const s of lowStock) {
    items.push({
      tag: "STOCK",
      text: `${s.name} at ${s.stockPct}% — ${s.units} units remaining`,
      tone: "red",
    })
  }
  const urgent = grievances.filter((g) => g.urgency === "high")
  for (const g of urgent) {
    items.push({ tag: "GRIEVANCE", text: `${g.facilityId} — ${g.message}`, tone: "amber" })
  }
  return items
}

function Segment({ items }: { items: TickerItem[] }) {
  return (
    <>
      {items.map((it, i) => (
        <span key={i} className="flex shrink-0 items-center gap-2 px-5">
          <span
            className={`led ${it.tone === "red" ? "led-red" : it.tone === "amber" ? "led-amber" : "led-green"}`}
          />
          <span className="eyebrow text-muted-foreground">{it.tag}</span>
          <span className="tabular text-xs text-foreground/80">{it.text}</span>
        </span>
      ))}
    </>
  )
}

/** Live Network Pulse — the ops-board signature: a scrolling status feed
 *  assembled directly from live facility, outbreak, stock, and grievance data. */
export function NetworkTicker() {
  const feed = buildFeed()
  return (
    <div className="ops-grid overflow-hidden border-b border-border bg-background/60">
      <div className="flex w-max ticker-track">
        <Segment items={feed} />
        <Segment items={feed} aria-hidden />
      </div>
    </div>
  )
}
