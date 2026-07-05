/**
 * Firestore schema reference for Smart Health 360.
 * Not executable — this is the contract every collection, security rule,
 * and Cloud Function in this backend is written against. Keep it in sync
 * when you add fields.
 */

export type Role = "patient" | "doctor" | "pharmacist" | "officer"

/** users/{uid} — one doc per authenticated account. Role also lives in the
 *  Auth custom claim (source of truth for security rules); this doc mirrors
 *  it for easy client reads/UI. */
export interface UserDoc {
  uid: string
  role: Role
  name: string
  phone: string
  facilityId: string | null // null for patients until they check in somewhere
  regionId: string | null // set for 'officer' role — scopes what they can see
  createdAt: number
}

/** facilities/{facilityId} — a PHC/CHC/hospital node in the network. */
export interface FacilityDoc {
  facilityId: string
  name: string
  type: "PHC" | "CHC" | "GH"
  regionId: string
  lat: number
  lng: number
}

/** beds/{bedId} — one doc per ward/bed-type per facility. Read by every
 *  patient's bed finder; written by doctor/officer roles. */
export interface BedDoc {
  facilityId: string
  facilityName: string
  type: string // "General Ward" | "ICU" | "Emergency" ...
  available: number
  total: number
  lat: number
  lng: number
  updatedAt: number
}

/** inventory/{itemId} — stock line per facility. Feeds expiry-risk +
 *  redistribution-matcher functions. */
export interface InventoryDoc {
  facilityId: string
  name: string
  sku: string
  category: string
  units: number
  stockPct: number // derived, recomputed on write by a Cloud Function
  expiryDate: number // epoch ms — source of truth; expiryLabel is derived for UI
  updatedAt: number
}

/** patientQueue/{id} — live OPD/triage queue at a facility. */
export interface QueueEntryDoc {
  facilityId: string
  patientUid: string
  name: string
  age: number
  token: string
  symptoms: string
  status: "stable" | "observation" | "critical"
  checkedInAt: number
}

/** grievances/{id} — patient complaints, escalated to officer role. */
export interface GrievanceDoc {
  facilityId: string
  patientUid: string
  category: string
  message: string
  urgency: "low" | "medium" | "high"
  status: "open" | "resolved"
  createdAt: number
}

/** outbreaks/{id} — disease-signal rollups per region, officer dashboard. */
export interface OutbreakDoc {
  disease: string
  regionId: string
  cases: number
  changePct: number
  level: "watch" | "alert"
  updatedAt: number
}

/** redistributionContracts/{id} — proposals + decisions from the matcher
 *  Cloud Function. Officers approve/reject; approval triggers inventory
 *  writes on both facilities. */
export interface RedistributionContractDoc {
  itemSku: string
  itemName: string
  surplusFacilityId: string
  deficitFacilityId: string
  units: number
  distanceKm: number
  confidence: number // 0-1
  status: "proposed" | "approved" | "rejected" | "completed"
  createdAt: number
  decidedAt: number | null
  decidedBy: string | null // uid
}

/** sosEvents/{id} — emergency dispatch records. */
export interface SosEventDoc {
  patientUid: string
  lat: number
  lng: number
  status: "requested" | "dispatched" | "en_route" | "closed"
  ambulanceId: string | null
  etaMinutes: number | null
  createdAt: number
  updatedAt: number
}
