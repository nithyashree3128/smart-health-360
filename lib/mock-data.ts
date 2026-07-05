export type BedStatus = {
  id: string
  facility: string
  type: string
  available: number
  total: number
  distanceKm: number
}

export const beds: BedStatus[] = [
  {
    id: "b1",
    facility: "PHC Kovilpatti",
    type: "General Ward",
    available: 4,
    total: 20,
    distanceKm: 0.4,
  },
  {
    id: "b2",
    facility: "CHC Mettupalayam",
    type: "ICU",
    available: 2,
    total: 8,
    distanceKm: 6.1,
  },
  {
    id: "b3",
    facility: "General Hospital Coimbatore",
    type: "General Ward",
    available: 18,
    total: 120,
    distanceKm: 14.2,
  },
  {
    id: "b4",
    facility: "Sri Ramakrishna Hospital",
    type: "Emergency",
    available: 6,
    total: 30,
    distanceKm: 16.8,
  },
]

export type HealthMetric = {
  label: string
  value: string
  unit: string
  trend: "up" | "down" | "flat"
  status: "good" | "watch" | "alert"
}

export const patientMetrics: HealthMetric[] = [
  { label: "Blood Pressure", value: "128/84", unit: "mmHg", trend: "up", status: "watch" },
  { label: "Heart Rate", value: "76", unit: "bpm", trend: "flat", status: "good" },
  { label: "Blood Glucose", value: "112", unit: "mg/dL", trend: "down", status: "good" },
  { label: "BMI", value: "23.4", unit: "kg/m²", trend: "flat", status: "good" },
]

export type ChatMessage = {
  id: string
  from: "ai" | "user"
  text: string
}

export const triageChat: ChatMessage[] = [
  {
    id: "m1",
    from: "ai",
    text: "Hello Priya. I'm your AI Health Assistant. How are you feeling today?",
  },
  {
    id: "m2",
    from: "user",
    text: "I've had a fever and headache since last night.",
  },
  {
    id: "m3",
    from: "ai",
    text: "Thanks. Any body ache, cough, or breathing difficulty? Based on your symptoms I'll suggest a triage level and nearby facilities.",
  },
]

export const quickReplies = [
  "Check Bed Vacancies",
  "Book Appointment",
  "Refill Prescription",
  "Emergency SOS",
]

export type QueuePatient = {
  id: string
  name: string
  age: number
  token: string
  symptoms: string
  status: "stable" | "observation" | "critical"
  waited: string
}

export const patientQueue: QueuePatient[] = [
  { id: "p1", name: "Ramesh K.", age: 54, token: "A-102", symptoms: "Chest tightness, sweating", status: "critical", waited: "2 min" },
  { id: "p2", name: "Lakshmi D.", age: 33, token: "A-103", symptoms: "High fever, dehydration", status: "observation", waited: "11 min" },
  { id: "p3", name: "Arjun S.", age: 27, token: "A-104", symptoms: "Fracture, left wrist", status: "observation", waited: "18 min" },
  { id: "p4", name: "Meena R.", age: 41, token: "A-105", symptoms: "Routine BP check", status: "stable", waited: "24 min" },
  { id: "p5", name: "Suresh P.", age: 60, token: "A-106", symptoms: "Diabetic follow-up", status: "stable", waited: "31 min" },
]

export type InventoryItem = {
  id: string
  name: string
  sku: string
  category: string
  stockPct: number
  units: number
  expiry: "ok" | "soon" | "expired"
  expiryLabel: string
}

export const inventory: InventoryItem[] = [
  { id: "i1", name: "Paracetamol 500mg", sku: "MED-PC-500", category: "Analgesic", stockPct: 12, units: 240, expiry: "ok", expiryLabel: "Nov 2026" },
  { id: "i2", name: "Amoxicillin 250mg", sku: "MED-AM-250", category: "Antibiotic", stockPct: 68, units: 1360, expiry: "soon", expiryLabel: "Mar 2026" },
  { id: "i3", name: "ORS Sachets", sku: "MED-ORS-01", category: "Rehydration", stockPct: 84, units: 4200, expiry: "ok", expiryLabel: "Aug 2027" },
  { id: "i4", name: "Insulin Glargine", sku: "MED-INS-10", category: "Antidiabetic", stockPct: 34, units: 90, expiry: "soon", expiryLabel: "Feb 2026" },
  { id: "i5", name: "Tetanus Vaccine", sku: "VAC-TT-05", category: "Vaccine", stockPct: 55, units: 320, expiry: "ok", expiryLabel: "Jul 2026" },
  { id: "i6", name: "Ibuprofen 400mg", sku: "MED-IB-400", category: "Analgesic", stockPct: 8, units: 96, expiry: "expired", expiryLabel: "Jan 2026" },
]

export type Grievance = {
  id: string
  facilityId: string
  message: string
  timestamp: string
  urgency: "low" | "medium" | "high"
}

export const grievances: Grievance[] = [
  { id: "g1", facilityId: "PHC-KVP-014", message: "No stock of insulin for 3 days at dispensary.", timestamp: "12 min ago", urgency: "high" },
  { id: "g2", facilityId: "CHC-MTP-007", message: "Long waiting time, only one doctor on duty.", timestamp: "48 min ago", urgency: "medium" },
  { id: "g3", facilityId: "PHC-KVP-014", message: "Water cooler in OPD not working.", timestamp: "2 hrs ago", urgency: "low" },
  { id: "g4", facilityId: "GH-CBE-001", message: "Ambulance response delayed by 25 minutes.", timestamp: "3 hrs ago", urgency: "high" },
]

export type MacroMetric = {
  label: string
  value: string
  sub: string
  status: "good" | "watch" | "alert"
}

export const macroMetrics: MacroMetric[] = [
  { label: "Regional Bed Vacancy", value: "27%", sub: "Coimbatore district", status: "watch" },
  { label: "System Transfer Success", value: "94.2%", sub: "Last 30 days", status: "good" },
  { label: "Active Outbreak Signals", value: "2", sub: "Dengue, Viral fever", status: "alert" },
  { label: "Facilities Online", value: "142 / 148", sub: "Live telemetry", status: "good" },
]

export type Outbreak = {
  disease: string
  cases: number
  change: string
  region: string
  level: "watch" | "alert"
}

export const outbreaks: Outbreak[] = [
  { disease: "Dengue", cases: 312, change: "+18%", region: "Kovilpatti cluster", level: "alert" },
  { disease: "Viral Fever", cases: 540, change: "+9%", region: "Mettupalayam", level: "watch" },
  { disease: "Acute Diarrhoea", cases: 128, change: "-4%", region: "Pollachi", level: "watch" },
]
