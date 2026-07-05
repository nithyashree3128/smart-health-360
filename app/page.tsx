"use client"

import { useState } from "react"
import { RoleSimulator } from "@/components/role-simulator"
import { LoginPortal } from "@/components/login-portal"
import { AppBar } from "@/components/app-bar"
import { PatientDashboard } from "@/components/dashboards/patient-dashboard"
import { DoctorDashboard } from "@/components/dashboards/doctor-dashboard"
import { PharmacistDashboard } from "@/components/dashboards/pharmacist-dashboard"
import { GovernmentDashboard } from "@/components/dashboards/government-dashboard"
import { t, type Lang } from "@/lib/i18n"
import { ROLE_META, type Role } from "@/lib/types"

export default function Page() {
  const [role, setRole] = useState<Role>("patient")
  const [lang, setLang] = useState<Lang>("en")
  const [authed, setAuthed] = useState(false)

  function handleRoleChange(next: Role) {
    setRole(next)
    // Re-authenticate when switching perspectives to showcase each portal.
    setAuthed(false)
  }

  return (
    <div className="min-h-dvh bg-background">
      <RoleSimulator role={role} onChange={handleRoleChange} />

      {!authed ? (
        <LoginPortal role={role} lang={lang} onLogin={() => setAuthed(true)} />
      ) : (
        <>
          <div className="h-16" aria-hidden="true" />
          <AppBar
            role={role}
            lang={lang}
            onLang={setLang}
            onLogout={() => setAuthed(false)}
          />
          <main className="mx-auto max-w-6xl px-4 py-6">
            <div className="mb-5 flex items-baseline gap-3 border-b border-border pb-4">
              <p className="eyebrow text-primary">{t("commandCenter", lang)}</p>
              <span className="h-1 w-1 rounded-full bg-border" />
              <h1 className="text-pretty text-lg font-bold tracking-wide text-foreground">
                {ROLE_META[role].label.toUpperCase()} {t("overview", lang).toUpperCase()}
              </h1>
            </div>

            {role === "patient" && <PatientDashboard lang={lang} />}
            {role === "doctor" && <DoctorDashboard lang={lang} />}
            {role === "pharmacist" && <PharmacistDashboard lang={lang} />}
            {role === "officer" && <GovernmentDashboard lang={lang} />}
          </main>
          <footer className="eyebrow border-t border-border py-6 text-center text-muted-foreground">
            SMART HEALTH 360 · PROTOTYPE · PHC/CHC OPERATING SYSTEM
          </footer>
        </>
      )}
    </div>
  )
}
