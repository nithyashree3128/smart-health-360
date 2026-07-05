"use client"

import { useEffect, useState } from "react"
import { MapPin, Ambulance, CheckCircle2, X, Loader2 } from "lucide-react"

const STEPS = [
  { label: "Locking GPS coordinates…", done: "GPS locked · 11.079°N, 77.049°E" },
  { label: "Contacting nearest dispatch center…", done: "Connected · Kovilpatti EMS" },
  { label: "Assigning nearest ambulance…", done: "TN-38-AZ-4412 dispatched · ETA 6 min" },
]

export function SosOverlay({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step >= STEPS.length) return
    const timer = setTimeout(() => setStep((s) => s + 1), 1400)
    return () => clearTimeout(timer)
  }, [step])

  const complete = step >= STEPS.length

  return (
    <div
      role="alertdialog"
      aria-label="Emergency SOS in progress"
      className="fixed inset-0 z-[80] grid place-items-center bg-background/90 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm rounded-md border border-signal-red/40 bg-card p-6 text-center">
        <p className="eyebrow mb-4 text-signal-red">EMERGENCY DISPATCH CHANNEL</p>
        <div className="relative mx-auto grid h-24 w-24 place-items-center">
          {!complete && (
            <>
              <span className="absolute inset-0 rounded-full bg-signal-red/30 animate-radar-ping" />
              <span className="absolute inset-0 rounded-full bg-signal-red/20 animate-radar-ping [animation-delay:0.6s]" />
            </>
          )}
          <span
            className={`relative grid h-20 w-20 place-items-center rounded-full text-white ${
              complete ? "bg-primary" : "bg-signal-red"
            }`}
          >
            {complete ? (
              <Ambulance className="h-9 w-9" />
            ) : (
              <MapPin className="h-9 w-9" />
            )}
          </span>
        </div>

        <h2 className="mt-4 text-lg font-bold text-foreground">
          {complete ? "Ambulance Dispatched" : "Emergency SOS Active"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {complete
            ? "Help is on the way. Stay calm and keep your phone nearby."
            : "Do not close this screen. Locating you and dispatching help."}
        </p>

        <ul className="mt-5 space-y-2 text-left">
          {STEPS.map((s, i) => {
            const isDone = i < step
            const isActive = i === step
            return (
              <li
                key={s.label}
                className={`flex items-start gap-2.5 rounded-md border px-3 py-2 text-sm ${
                  isDone
                    ? "border-primary/30 bg-primary/10 text-foreground"
                    : isActive
                      ? "border-signal-red/30 bg-signal-red/10 text-foreground"
                      : "border-border text-muted-foreground"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                ) : isActive ? (
                  <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-signal-red" />
                ) : (
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full border border-border" />
                )}
                <span className="tabular">{isDone ? s.done : s.label}</span>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-secondary px-4 py-2.5 text-sm font-semibold tracking-wide text-foreground transition hover:bg-panel-raised"
        >
          <X className="h-4 w-4" />
          {complete ? "CLOSE" : "CANCEL EMERGENCY"}
        </button>
      </div>
    </div>
  )
}
