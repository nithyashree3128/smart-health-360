"use client"

import { Bell, MapPin, LogOut } from "lucide-react"
import { Logo } from "@/components/shared"
import { LanguageSelector } from "@/components/language-selector"
import { NetworkTicker } from "@/components/network-ticker"
import { tl, type Lang } from "@/lib/i18n"
import { ROLE_META, type Role } from "@/lib/types"

const notifCounts: Record<Role, number> = {
  patient: 2,
  doctor: 5,
  pharmacist: 3,
  officer: 8,
}

export function AppBar({
  role,
  lang,
  onLang,
  onLogout,
}: {
  role: Role
  lang: Lang
  onLang: (l: Lang) => void
  onLogout: () => void
}) {
  const count = notifCounts[role]
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Logo size={38} />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-tight tracking-wide text-foreground">
            {tl("appName", lang)}
          </p>
          <p className="eyebrow flex items-center gap-1 truncate text-muted-foreground">
            <MapPin className="h-3 w-3 text-primary" />
            PHC-KVP-014 · REGION: COIMBATORE
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSelector lang={lang} onChange={onLang} />

          <button
            type="button"
            aria-label={`Notifications, ${count} unread`}
            className="relative grid h-9 w-9 place-items-center rounded-md border border-border bg-secondary text-foreground transition hover:bg-panel-raised"
          >
            <Bell className="h-4 w-4" />
            {count > 0 && (
              <span className="tabular absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-sm bg-signal-red px-1 text-[10px] font-bold text-white ring-2 ring-card">
                {count}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2 rounded-md border border-border bg-secondary py-1 pl-1 pr-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-sm bg-primary/15 text-xs font-bold text-primary">
              {ROLE_META[role].short.charAt(0)}
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-semibold text-foreground">
                {ROLE_META[role].short}
              </p>
              <p className="eyebrow text-muted-foreground">{ROLE_META[role].badge}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            aria-label="Sign out"
            className="grid h-9 w-9 place-items-center rounded-md border border-border bg-secondary text-muted-foreground transition hover:bg-panel-raised hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
      <NetworkTicker />
    </header>
  )
}
