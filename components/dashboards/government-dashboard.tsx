"use client"

import { useState } from "react"
import {
  BedDouble,
  ShieldCheck,
  Activity,
  ServerCog,
  Siren,
  TrendingUp,
  MessageSquareWarning,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { Card, SectionHeading, Badge } from "@/components/shared"
import { ResourceRedistributionEngine } from "@/components/resource-redistribution-engine"
import { t, type Lang } from "@/lib/i18n"
import {
  grievances as seedGrievances,
  macroMetrics,
  outbreaks,
  type Grievance,
  type MacroMetric,
} from "@/lib/mock-data"

const metricIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  "Regional Bed Vacancy": BedDouble,
  "System Transfer Success": ShieldCheck,
  "Active Outbreak Signals": Activity,
  "Facilities Online": ServerCog,
}

const urgencyTone: Record<Grievance["urgency"], "green" | "amber" | "red"> = {
  low: "green",
  medium: "amber",
  high: "red",
}

export function GovernmentDashboard({ lang }: { lang: Lang }) {
  const [items, setItems] = useState<Grievance[]>(seedGrievances)

  function address(id: string) {
    setItems((prev) => prev.filter((g) => g.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Macro metrics */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {macroMetrics.map((m) => (
          <MacroCard key={m.label} metric={m} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Outbreaks */}
        <Card className="lg:col-span-1">
          <SectionHeading
            title="High-Demand Disease Outbreaks"
            icon={TrendingUp}
            action={<Badge tone="red">2 alerts</Badge>}
          />
          <ul className="space-y-2.5">
            {outbreaks.map((o) => (
              <li key={o.disease} className="rounded-md border border-border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{o.disease}</p>
                  <Badge tone={o.level === "alert" ? "red" : "amber"}>{o.change}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {o.cases} active cases · {o.region}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        {/* Grievance panel */}
        <Card className="lg:col-span-2">
          <SectionHeading
            title={t("grievancePanel", lang)}
            icon={MessageSquareWarning}
            action={<Badge tone={items.length ? "amber" : "green"}>{items.length} open</Badge>}
          />
          {items.length === 0 ? (
            <div className="flex items-center gap-2 rounded-md bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
              <CheckCircle2 className="h-4 w-4" />
              All grievances addressed. Great work!
            </div>
          ) : (
            <ul className="space-y-2.5">
              {items.map((g) => (
                <li
                  key={g.id}
                  className="flex flex-col gap-3 rounded-md border border-border p-3 sm:flex-row sm:items-center"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {g.facilityId}
                      </span>
                      <Badge tone={urgencyTone[g.urgency]} pulse={g.urgency === "high"}>
                        {g.urgency} urgency
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {g.timestamp}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-foreground">{g.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => address(g.id)}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Address Grievance
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <ResourceRedistributionEngine lang={lang} />
    </div>
  )
}

function MacroCard({ metric }: { metric: MacroMetric }) {
  const Icon = metricIcon[metric.label] ?? Activity
  const tone =
    metric.status === "good"
      ? "text-primary"
      : metric.status === "watch"
        ? "text-signal-amber"
        : "text-signal-red"
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <Icon className={`h-5 w-5 ${tone}`} />
        {metric.status === "alert" && <Siren className="h-4 w-4 animate-flash-alert text-signal-red" />}
      </div>
      <p className={`mt-2 text-2xl font-bold ${tone}`}>{metric.value}</p>
      <p className="text-xs font-medium text-foreground">{metric.label}</p>
      <p className="truncate text-xs text-muted-foreground">{metric.sub}</p>
    </Card>
  )
}
