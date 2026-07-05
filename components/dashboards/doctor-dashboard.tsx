"use client"

import { Users, ListChecks, Siren, ClipboardList } from "lucide-react"
import { Card, SectionHeading, Badge } from "@/components/shared"
import { t, type Lang } from "@/lib/i18n"
import { patientQueue, type QueuePatient } from "@/lib/mock-data"

const statusTone: Record<QueuePatient["status"], "green" | "amber" | "red"> = {
  stable: "green",
  observation: "amber",
  critical: "red",
}

const statusLabel: Record<QueuePatient["status"], string> = {
  stable: "Stable",
  observation: "Observation",
  critical: "Critical",
}

export function DoctorDashboard({ lang }: { lang: Lang }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Metric
          icon={Users}
          label="Patients Logged Today"
          value="48"
          sub="+12 vs. yesterday"
          tone="green"
        />
        <Metric
          icon={ListChecks}
          label="Clinic Queue Status"
          value="5 waiting"
          sub="Avg wait 19 min"
          tone="amber"
        />
        <Metric
          icon={Siren}
          label="Active Emergency Alerts"
          value="1 critical"
          sub="Token A-102 · needs review"
          tone="red"
        />
      </div>

      <Card>
        <SectionHeading
          title={t("patientQueue", lang)}
          icon={ClipboardList}
          action={<Badge tone="amber">Live queue · 5</Badge>}
        />
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-y-1.5 px-2 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-1 font-medium">Token</th>
                <th className="px-3 py-1 font-medium">Patient</th>
                <th className="px-3 py-1 font-medium">Age</th>
                <th className="px-3 py-1 font-medium">Symptoms</th>
                <th className="px-3 py-1 font-medium">Waited</th>
                <th className="px-3 py-1 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {patientQueue.map((p) => (
                <tr key={p.id} className="bg-secondary">
                  <td className="rounded-l-xl px-3 py-3 font-mono text-xs font-semibold text-foreground">
                    {p.token}
                  </td>
                  <td className="px-3 py-3 font-medium text-foreground">
                    {p.name}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{p.age}</td>
                  <td className="px-3 py-3 text-muted-foreground">{p.symptoms}</td>
                  <td className="px-3 py-3 text-muted-foreground">{p.waited}</td>
                  <td className="rounded-r-xl px-3 py-3">
                    <Badge tone={statusTone[p.status]} pulse={p.status === "critical"}>
                      {statusLabel[p.status]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
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
