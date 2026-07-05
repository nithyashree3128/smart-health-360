/**
 * Seeds Firestore with demo data matching lib/firebase/schema.ts, derived
 * from your existing lib/mock-data.ts so the app looks identical on first
 * run whether it's reading mock arrays or live Firestore.
 *
 * Usage:
 *   Against the emulator (safe, default):
 *     firebase emulators:start --only firestore &
 *     FIRESTORE_EMULATOR_HOST=localhost:8080 npx tsx scripts/seed.ts
 *
 *   Against your real project (careful — writes real data):
 *     GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json npx tsx scripts/seed.ts
 */
import { initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

initializeApp()
const db = getFirestore()

const facilities = [
  { facilityId: "PHC-KVP-014", name: "PHC Kovilpatti", type: "PHC", regionId: "coimbatore", lat: 11.079, lng: 77.049 },
  { facilityId: "CHC-MTP-007", name: "CHC Mettupalayam", type: "CHC", regionId: "coimbatore", lat: 11.299, lng: 76.941 },
  { facilityId: "GH-CBE-001", name: "General Hospital Coimbatore", type: "GH", regionId: "coimbatore", lat: 11.0168, lng: 76.9558 },
  { facilityId: "HOSP-SRK-002", name: "Sri Ramakrishna Hospital", type: "GH", regionId: "coimbatore", lat: 11.001, lng: 76.961 },
]

const beds = [
  { facilityId: "PHC-KVP-014", facilityName: "PHC Kovilpatti", type: "General Ward", available: 4, total: 20, lat: 11.079, lng: 77.049 },
  { facilityId: "CHC-MTP-007", facilityName: "CHC Mettupalayam", type: "ICU", available: 2, total: 8, lat: 11.299, lng: 76.941 },
  { facilityId: "GH-CBE-001", facilityName: "General Hospital Coimbatore", type: "General Ward", available: 18, total: 120, lat: 11.0168, lng: 76.9558 },
  { facilityId: "HOSP-SRK-002", facilityName: "Sri Ramakrishna Hospital", type: "Emergency", available: 6, total: 30, lat: 11.001, lng: 76.961 },
]

const dayMs = 86_400_000
const now = Date.now()
const inventory = [
  { facilityId: "PHC-KVP-014", name: "Paracetamol 500mg", sku: "MED-PC-500", category: "Analgesic", units: 240, stockPct: 12, expiryDate: now + 300 * dayMs },
  { facilityId: "CHC-MTP-007", name: "Amoxicillin 250mg", sku: "MED-AM-250", category: "Antibiotic", units: 1360, stockPct: 68, expiryDate: now + 60 * dayMs },
  { facilityId: "PHC-KVP-014", name: "ORS Sachets", sku: "MED-ORS-01", category: "Rehydration", units: 4200, stockPct: 84, expiryDate: now + 400 * dayMs },
  { facilityId: "PHC-KVP-014", name: "Insulin Glargine", sku: "MED-INS-10", category: "Antidiabetic", units: 90, stockPct: 8, expiryDate: now + 45 * dayMs },
  { facilityId: "GH-CBE-001", name: "Insulin Glargine", sku: "MED-INS-10", category: "Antidiabetic", units: 900, stockPct: 82, expiryDate: now + 200 * dayMs },
  { facilityId: "CHC-MTP-007", name: "Tetanus Vaccine", sku: "VAC-TT-05", category: "Vaccine", units: 320, stockPct: 55, expiryDate: now + 150 * dayMs },
  { facilityId: "PHC-KVP-014", name: "Ibuprofen 400mg", sku: "MED-IB-400", category: "Analgesic", units: 96, stockPct: 8, expiryDate: now - 2 * dayMs },
]

const outbreaks = [
  { disease: "Dengue", regionId: "coimbatore", cases: 312, changePct: 18, level: "alert" },
  { disease: "Viral Fever", regionId: "coimbatore", cases: 540, changePct: 9, level: "watch" },
  { disease: "Acute Diarrhoea", regionId: "coimbatore", cases: 128, changePct: -4, level: "watch" },
]

async function seed() {
  const batch = db.batch()

  for (const f of facilities) batch.set(db.doc(`facilities/${f.facilityId}`), f)
  for (const b of beds) batch.set(db.collection("beds").doc(), { ...b, updatedAt: now })
  for (const i of inventory) batch.set(db.collection("inventory").doc(), { ...i, updatedAt: now })
  for (const o of outbreaks) batch.set(db.collection("outbreaks").doc(), { ...o, updatedAt: now })

  await batch.commit()
  console.log(
    `Seeded ${facilities.length} facilities, ${beds.length} beds, ${inventory.length} inventory items, ${outbreaks.length} outbreak signals.`,
  )
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
