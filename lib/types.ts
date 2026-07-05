export type Role = "patient" | "doctor" | "pharmacist" | "officer"

export const ROLE_META: Record<
  Role,
  { label: string; short: string; badge: string }
> = {
  patient: { label: "Patient", short: "Patient", badge: "Public User" },
  doctor: { label: "Doctor / Nurse", short: "Doctor", badge: "Medical Staff" },
  pharmacist: { label: "Pharmacist", short: "Pharmacist", badge: "Dispensary" },
  officer: {
    label: "Government Officer",
    short: "Officer",
    badge: "District Admin",
  },
}
