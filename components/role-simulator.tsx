"use client"

import { useState } from "react"
import { Stethoscope, User, Pill, Landmark, FlaskConical, ChevronUp } from "lucide-react"
import { ROLE_META, type Role } from "@/lib/types"
import { cn } from "@/lib/utils"

const icons: Record<Role, React.ComponentType<{ className?: string }>> = {
  patient: User,
  doctor: Stethoscope,
  pharmacist: Pill,
  officer: Landmark,
}

const order: Role[] = ["patient", "doctor", "pharmacist", "officer"]

export function RoleSimulator({
  role,
  onChange,
}: {
  role: Role
  onChange: (r: Role) => void
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-3">
      <div className="w-full max-w-3xl rounded-md border border-primary/20 bg-primary/95 p-2 text-primary-foreground border border-border backdrop-blur supports-[backdrop-filter]:bg-primary/90">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 text-xs font-semibold uppercase tracking-wide">
            <FlaskConical className="h-4 w-4" />
            <span className="hidden sm:inline">Role Simulator</span>
            <span className="sm:hidden">Role</span>
          </div>

          {!collapsed && (
            <div className="flex flex-1 flex-wrap gap-1.5 sm:flex-nowrap">
              {order.map((r) => {
                const Icon = icons[r]
                const active = r === role
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => onChange(r)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                      active
                        ? "bg-white text-primary border border-border"
                        : "bg-white/10 text-primary-foreground hover:bg-white/20",
                    )}
                    aria-pressed={active}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{ROLE_META[r].short}</span>
                  </button>
                )
              })}
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand role simulator" : "Collapse role simulator"}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 hover:bg-white/20"
          >
            <ChevronUp className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>
        {!collapsed && (
          <p className="px-2 pt-1.5 text-[11px] text-primary-foreground/80">
            Prototype control — switch perspectives to preview each role&apos;s command center.
          </p>
        )}
      </div>
    </div>
  )
}
