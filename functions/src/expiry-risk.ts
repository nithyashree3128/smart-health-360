import { onSchedule } from "firebase-functions/v2/scheduler"
import { onCall } from "firebase-functions/v2/https"
import { db } from "./admin"

const MS_PER_DAY = 86_400_000

function riskLevel(daysToExpiry: number, stockPct: number): "ok" | "soon" | "expired" {
  if (daysToExpiry <= 0) return "expired"
  // "soon" combines a time window AND stock level: high stock expiring
  // soon is a bigger waste risk than low stock expiring soon (which will
  // likely sell through anyway) — same weighting as the original module.
  if (daysToExpiry <= 60 && stockPct > 15) return "soon"
  if (daysToExpiry <= 21) return "soon"
  return "ok"
}

async function sweepExpiryRisk() {
  const snap = await db.collection("inventory").get()
  const now = Date.now()
  const batch = db.batch()
  const flagged: { id: string; name: string; facilityId: string; daysToExpiry: number }[] = []

  snap.forEach((doc) => {
    const item = doc.data() as any
    const daysToExpiry = Math.round((item.expiryDate - now) / MS_PER_DAY)
    const expiry = riskLevel(daysToExpiry, item.stockPct)
    batch.update(doc.ref, { expiry, updatedAt: now })
    if (expiry !== "ok") {
      flagged.push({ id: doc.id, name: item.name, facilityId: item.facilityId, daysToExpiry })
    }
  })

  await batch.commit()
  return flagged
}

/** Runs once a day so every inventory doc's `expiry` field stays current
 *  without the client having to compute it from a raw date. */
export const expiryRiskDailySweep = onSchedule("every day 03:00", async () => {
  const flagged = await sweepExpiryRisk()
  console.log(`Expiry sweep flagged ${flagged.length} items`, flagged)
})

/** Callable version so the officer/pharmacist dashboard can trigger an
 *  on-demand re-check instead of waiting for the nightly run. */
export const runExpiryRiskCheck = onCall(async () => {
  const flagged = await sweepExpiryRisk()
  return { flaggedCount: flagged.length, flagged }
})
