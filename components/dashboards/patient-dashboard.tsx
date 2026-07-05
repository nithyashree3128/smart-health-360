"use client"

import { useState } from "react"
import {
  Activity,
  BedDouble,
  Bot,
  HeartPulse,
  MapPin,
  MessageSquareWarning,
  Send,
  Siren,
  TrendingDown,
  TrendingUp,
  Minus,
  Navigation,
} from "lucide-react"
import { Card, SectionHeading, Badge } from "@/components/shared"
import { SosOverlay } from "@/components/sos-overlay"
import { t, tl, type Lang } from "@/lib/i18n"
import {
  beds,
  patientMetrics,
  quickReplies,
  triageChat,
  type ChatMessage,
} from "@/lib/mock-data"

export function PatientDashboard({ lang }: { lang: Lang }) {
  const [sos, setSos] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(triageChat)
  const [input, setInput] = useState("")
  const [grievanceSent, setGrievanceSent] = useState(false)

  function send(text: string) {
    const clean = text.trim()
    if (!clean) return
    if (clean.toLowerCase().includes("sos") || clean.toLowerCase().includes("emergency")) {
      setSos(true)
    }
    const userMsg: ChatMessage = { id: `u${Date.now()}`, from: "user", text: clean }
    const aiMsg: ChatMessage = {
      id: `a${Date.now()}`,
      from: "ai",
      text: "Noted. I recommend an in-person triage (Amber). PHC Kovilpatti has 4 beds available, 0.4 km away. Would you like me to reserve a token?",
    }
    setMessages((m) => [...m, userMsg, aiMsg])
    setInput("")
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Health metrics */}
        <div className="lg:col-span-3">
          <SectionHeading title={t("digitalProfile", lang)} icon={HeartPulse} eyebrow="PATIENT VITALS · LIVE" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {patientMetrics.map((m) => (
              <Card key={m.label} className="p-4">
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-muted-foreground">
                    {m.label}
                  </span>
                  <TrendIcon trend={m.trend} status={m.status} />
                </div>
                <p className="tabular mt-2 text-2xl font-bold text-foreground">
                  {m.value}
                </p>
                <p className="eyebrow text-muted-foreground">{m.unit}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Triage chatbot */}
        <Card className="flex flex-col lg:col-span-2">
          <SectionHeading
            title={t("aiHealthAssistant", lang)}
            icon={Bot}
            eyebrow="TRIAGE CHANNEL"
            action={<Badge tone="green">ONLINE</Badge>}
          />
          <div className="flex-1 space-y-3 overflow-y-auto rounded-md border border-border bg-background/60 p-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-[80%] items-start gap-2 rounded-md px-3.5 py-2 text-sm ${
                    m.from === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground ring-1 ring-border"
                  }`}
                >
                  {m.from === "ai" && (
                    <Bot className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  )}
                  <span className="leading-relaxed">{m.text}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {quickReplies.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => (q === "Emergency SOS" ? setSos(true) : send(q))}
                className={`eyebrow rounded-sm px-3 py-1.5 ring-1 ring-inset transition ${
                  q === "Emergency SOS"
                    ? "bg-signal-red/10 text-signal-red ring-signal-red/25 hover:bg-signal-red/20"
                    : "bg-primary/10 text-primary ring-primary/20 hover:bg-primary/20"
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="mt-3 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms…"
              className="flex-1 rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground transition hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </Card>

        {/* Right column: SOS + bed finder */}
        <div className="flex flex-col gap-4">
          <Card className="border-signal-red/40 bg-signal-red/5">
            <p className="eyebrow mb-2 text-signal-red">PRIORITY CHANNEL</p>
            <div className="flex items-center gap-2 text-signal-red">
              <Siren className="h-5 w-5" />
              <h2 className="text-base font-semibold">{t("emergencySOS", lang)}</h2>
            </div>
            <p className="mt-1 text-xs text-signal-red/80">
              Instantly locks your GPS and dispatches the nearest ambulance.
            </p>
            <button
              type="button"
              onClick={() => setSos(true)}
              className="animate-sos-pulse mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-signal-red py-4 text-base font-bold tracking-wide text-white transition hover:opacity-90"
            >
              <Siren className="h-5 w-5" />
              SOS — Get Help Now
            </button>
          </Card>

          <Card>
            <SectionHeading title={t("bedFinder", lang)} icon={BedDouble} eyebrow="LIVE CAPACITY FEED" />
            <ul className="space-y-2.5">
              {beds.map((b) => (
                <li
                  key={b.id}
                  className="rounded-md border border-border p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {b.facility}
                      </p>
                      <p className="eyebrow text-muted-foreground">{b.type}</p>
                    </div>
                    <Badge tone={b.available > 3 ? "green" : b.available > 0 ? "amber" : "red"}>
                      {b.available} FREE
                    </Badge>
                  </div>
                  <div className="tabular mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {b.distanceKm} km
                    </span>
                    <span className="flex items-center gap-1 font-medium text-primary">
                      <Navigation className="h-3 w-3" />
                      DIRECTIONS
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Grievance form */}
        <Card className="lg:col-span-3">
          <SectionHeading title={t("grievanceBox", lang)} icon={MessageSquareWarning} eyebrow="ADMIN ESCALATION" />
          {grievanceSent ? (
            <div className="flex items-center gap-2 rounded-md border border-primary/25 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
              <Activity className="h-4 w-4" />
              Complaint logged to PHC Kovilpatti admin. Reference #GRV-
              {Math.floor(Math.random() * 9000 + 1000)}. You&apos;ll be notified on resolution.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setGrievanceSent(true)
              }}
              className="grid gap-3 sm:grid-cols-2"
            >
              <select
                required
                defaultValue=""
                className="rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="" disabled>
                  Select issue category
                </option>
                <option>Medicine unavailable</option>
                <option>Long waiting time</option>
                <option>Staff behaviour</option>
                <option>Facility / hygiene</option>
                <option>Billing / charges</option>
              </select>
              <input
                required
                placeholder="Facility (e.g. PHC Kovilpatti)"
                defaultValue="PHC Kovilpatti"
                className="rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <textarea
                required
                rows={3}
                placeholder="Describe your complaint in detail…"
                className="rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:col-span-2"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold tracking-wide text-primary-foreground transition hover:opacity-90 sm:col-span-2 sm:w-fit"
              >
                <Send className="h-4 w-4" />
                SUBMIT TO ADMIN
              </button>
            </form>
          )}
        </Card>
      </div>

      {sos && <SosOverlay onClose={() => setSos(false)} />}
    </>
  )
}

function TrendIcon({
  trend,
  status,
}: {
  trend: "up" | "down" | "flat"
  status: "good" | "watch" | "alert"
}) {
  const color =
    status === "good"
      ? "text-primary"
      : status === "watch"
        ? "text-signal-amber"
        : "text-signal-red"
  const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus
  return <Icon className={`h-4 w-4 ${color}`} />
}
