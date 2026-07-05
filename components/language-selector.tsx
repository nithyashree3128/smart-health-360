"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown, Globe } from "lucide-react"
import { LANGUAGES, type Lang } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function LanguageSelector({
  lang,
  onChange,
}: {
  lang: Lang
  onChange: (l: Lang) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0]

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
      >
        <Globe className="h-4 w-4 text-primary" />
        <span className="hidden sm:inline">{current.native}</span>
        <ChevronDown
          className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-md border border-border bg-popover p-1.5"
        >
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === lang}
                onClick={() => {
                  onChange(l.code)
                  setOpen(false)
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-secondary",
                  l.code === lang && "bg-primary/10",
                )}
              >
                <span>
                  <span className="font-medium text-foreground">{l.native}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{l.label}</span>
                </span>
                {l.code === lang && <Check className="h-4 w-4 text-primary" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
