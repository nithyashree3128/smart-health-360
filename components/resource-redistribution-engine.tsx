"use client"

import { useState } from "react"
import {
  ArrowRight,
  Boxes,
  CircleCheck,
  Gauge,
  Route,
  Sparkles,
  Truck,
  X,
} from "lucide-react"
import { Card, SectionHeading, Badge } from "@/components/shared"
import { t, type Lang } from "@/lib/i18n"

type Decision = "pending" | "approved" | "rejected"

export function ResourceRedistributionEngine({ lang }: { lang: Lang }) {
  const [decision, setDecision] = useState<Decision>("pending")

  return (
    <Card className="border-primary/30 bg-gradient-to-b from-primary/5 to-card">
      <SectionHeading
        title={t("redistribution", lang)}
        icon={Sparkles}
        action={<Badge tone="green">Live · Autonomous</Badge>}
      />

      {/* Supply vector balances */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <VectorTile
          icon={Boxes}
          label="Surplus Node"
          value="+2,500"
          sub="GH Coimbatore"
          tone="green"
        />
        <VectorTile
          icon={Gauge}
          label="Deficit Node"
          value="12%"
          sub="PHC Kovilpatti"
          tone="red"
        />
        <VectorTile
          icon={Route}
          label="Route Distance"
          value="14.2 km"
          sub="Optimized path"
          tone="blue"
        />
      </div>

      {/* Proposed transfer */}
      <div className="mt-4 rounded-md border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            Contract [tx-908]
          </span>
          <Badge tone="green">AI Confidence 94%</Badge>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <NodeChip name="GH Coimbatore" role="Surplus" tone="green" />
          <div className="flex flex-1 flex-col items-center">
            <Truck className="h-5 w-5 text-primary" />
            <div className="my-1 h-0.5 w-full bg-gradient-to-r from-primary/30 via-primary to-primary/30" />
            <span className="text-[11px] font-medium text-muted-foreground">
              2,500 units
            </span>
          </div>
          <NodeChip name="PHC Kovilpatti" role="Deficit" tone="red" />
        </div>

        <p className="mt-3 text-sm leading-relaxed text-foreground">
          Proposing transfer of{" "}
          <span className="font-semibold">2,500 units of Paracetamol 500mg</span>{" "}
          from General Hospital Coimbatore (Surplus Node) to PHC Kovilpatti
          (Deficit Node). Estimated Distance:{" "}
          <span className="font-semibold">14.2 km</span>. AI Confidence Rate:{" "}
          <span className="font-semibold text-primary">94%</span>.
        </p>

        {decision === "pending" ? (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setDecision("approved")}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground border border-border transition hover:opacity-90"
            >
              <CircleCheck className="h-4 w-4" />
              Approve Optimization Contract
            </button>
            <button
              type="button"
              onClick={() => setDecision("rejected")}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary"
            >
              <X className="h-4 w-4" />
              Reject / Reroute
            </button>
          </div>
        ) : (
          <div
            className={`mt-4 flex items-center gap-2 rounded-md px-4 py-3 text-sm font-medium ${
              decision === "approved"
                ? "bg-primary/10 text-primary"
                : "bg-signal-amber/10 text-signal-amber"
            }`}
          >
            {decision === "approved" ? (
              <>
                <CircleCheck className="h-4 w-4" />
                Contract tx-908 approved — logistics dispatched. ETA 42 min.
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4" />
                Contract tx-908 rejected — AI is computing an alternate route.
              </>
            )}
            <button
              type="button"
              onClick={() => setDecision("pending")}
              className="ml-auto text-xs underline underline-offset-2 opacity-80 hover:opacity-100"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}

function VectorTile({
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
  tone: "green" | "red" | "blue"
}) {
  const toneText =
    tone === "green"
      ? "text-primary"
      : tone === "red"
        ? "text-signal-red"
        : "text-sky-600"
  return (
    <div className="rounded-md border border-border bg-card p-3">
      <Icon className={`h-4 w-4 ${toneText}`} />
      <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={`text-lg font-bold ${toneText}`}>{value}</p>
      <p className="truncate text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

function NodeChip({
  name,
  role,
  tone,
}: {
  name: string
  role: string
  tone: "green" | "red"
}) {
  return (
    <div className="w-24 shrink-0 text-center">
      <div
        className={`mx-auto grid h-9 w-9 place-items-center rounded-full text-xs font-bold ${
          tone === "green"
            ? "bg-primary/10 text-primary"
            : "bg-signal-red/15 text-signal-red"
        }`}
      >
        {role.charAt(0)}
      </div>
      <p className="mt-1 truncate text-[11px] font-medium text-foreground">{name}</p>
      <p className="text-[10px] text-muted-foreground">{role}</p>
    </div>
  )
}
