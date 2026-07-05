"use client"

import { useState } from "react"
import { Eye, EyeOff, Info, ShieldCheck, ArrowRight } from "lucide-react"
import { Logo } from "@/components/shared"
import { t, tl, type Lang } from "@/lib/i18n"
import { ROLE_META, type Role } from "@/lib/types"
import { cn } from "@/lib/utils"

export function LoginPortal({
  role,
  lang,
  onLogin,
}: {
  role: Role
  lang: Lang
  onLogin: () => void
}) {
  const [showPw, setShowPw] = useState(false)
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [doctorId, setDoctorId] = useState("")
  const isDoctor = role === "doctor"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onLogin()
  }

  return (
    <main className="ops-grid grid min-h-dvh place-items-center bg-background px-4 pb-10 pt-28">
      <div className="w-full max-w-md">
        <div className="rounded-md border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <Logo size={52} />
            <h1 className="mt-4 text-xl font-bold tracking-wide text-foreground">
              {tl("appName", lang)}
            </h1>
            <p className="eyebrow mt-1 text-primary">{t("tagline", lang)}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-sm bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/25">
              <ShieldCheck className="h-3.5 w-3.5" />
              {ROLE_META[role].label} Portal
            </span>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <Field label="Phone / Email">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="+91 98765 43210"
                className="tabular w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </Field>

            <Field label="Password">
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 pr-11 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            {isDoctor && (
              <Field label="Unique Doctor Identification Number (NMC/SMC Reg No.)">
                <input
                  type="text"
                  required
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  placeholder="e.g. TN-2019-045128"
                  className="tabular w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </Field>
            )}

            <button
              type="submit"
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold tracking-wide text-primary-foreground transition hover:opacity-90"
            >
              {t("signIn", lang).toUpperCase()}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-5 flex gap-2.5 rounded-md bg-secondary p-3 text-xs leading-relaxed text-muted-foreground ring-1 ring-inset ring-border">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>
              Public/Patients can self-register using any Indian (+91) mobile
              number. Medical Staff, Doctors, and Admins must authenticate via
              pre-authorized <span className="font-medium text-foreground">Organizational Whitelist</span> credentials.
            </p>
          </div>
        </div>

        <p className="eyebrow mt-4 text-center text-muted-foreground">
          Switch roles anytime using the Role Simulator at the top.
        </p>
      </div>
    </main>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className={cn("flex flex-col gap-1.5")}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  )
}
