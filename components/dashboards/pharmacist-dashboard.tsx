"use client"

import { Boxes, AlertTriangle, CalendarClock, PackageX } from "lucide-react"
import { Card, SectionHeading, Badge, StockBar } from "@/components/shared"
import { ResourceRedistributionEngine } from "@/components/resource-redistribution-engine"
import { t, type Lang } from "@/lib/i18n"
import { inventory, type InventoryItem } from "@/lib/mock-data"

const expiryBadge: Record<InventoryItem["expiry"], { tone: "green" | "amber" | "red"; label: string }> = {
  ok: { tone: "green", label: "In date" },
  soon: { tone: "amber", label: "Expiring soon" },
  expired: { tone: "red", label: "Expired" },
}

export function PharmacistDashboard({ lang }: { lang: Lang }) {
  const lowStock = inventory.filter((i) => i.stockPct < 20).length
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Metric icon={Boxes} label="Total SKUs" value={String(inventory.length)} sub="Tracked medicines" tone="green" />
        <Metric icon={AlertTriangle} label="Low Stock Items" value={String(lowStock)} sub="Below 20% threshold" tone="red" />
        <Metric icon={CalendarClock} label="Expiry Alerts" value="2" sub="Within 60 days" tone="amber" />
      </div>

      <Card>
        <SectionHeading
          title={t("inventoryLedger", lang)}
          icon={Boxes}
          action={
            <Badge tone="red" pulse>
              <AlertTriangle className="h-3 w-3" />
              Paracetamol 500mg low
            </Badge>
          }
        />
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate border-spacing-y-1.5 px-2 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-1 font-medium">Medicine</th>
                <th className="px-3 py-1 font-medium">SKU</th>
                <th className="px-3 py-1 font-medium">Category</th>
                <th className="px-3 py-1 font-medium">Stock Level</th>
                <th className="px-3 py-1 font-medium">Expiry</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const low = item.stockPct < 20
                const exp = expiryBadge[item.expiry]
                return (
                  <tr key={item.id} className={low ? "bg-signal-red/10" : "bg-secondary"}>
                    <td className="rounded-l-xl px-3 py-3 font-medium text-foreground">
                      <span className="flex items-center gap-2">
                        {low && (
                          <PackageX className="h-4 w-4 shrink-0 animate-flash-alert text-signal-red" />
                        )}
                        {item.name}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                      {item.sku}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{item.category}</td>
                    <td className="px-3 py-3">
                      <StockBar pct={item.stockPct} />
                    </td>
                    <td className="rounded-r-xl px-3 py-3">
                      <span className="flex flex-col gap-1">
                        <Badge tone={exp.tone}>{exp.label}</Badge>
                        <span className="text-[11px] text-muted-foreground">{item.expiryLabel}</span>
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <ResourceRedistributionEngine lang={lang} />
    </div>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  sub: string
  tone: "green" | "amber" | "red"
}) {
  const bg =
    tone === "green"
      ? "bg-primary/10 text-primary"
      : tone === "amber"
        ? "bg-signal-amber/15 text-signal-amber"
        : "bg-signal-red/15 text-signal-red"
  return (
    <Card className="flex items-center gap-3.5">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-md ${bg}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-lg font-bold text-foreground">{value}</p>
        <p className="truncate text-xs text-muted-foreground">{sub}</p>
      </div>
    </Card>
  )
}
