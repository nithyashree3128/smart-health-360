"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runExpiryRiskCheck = exports.expiryRiskDailySweep = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const https_1 = require("firebase-functions/v2/https");
const admin_1 = require("./admin");
const MS_PER_DAY = 86400000;
function riskLevel(daysToExpiry, stockPct) {
    if (daysToExpiry <= 0)
        return "expired";
    // "soon" combines a time window AND stock level: high stock expiring
    // soon is a bigger waste risk than low stock expiring soon (which will
    // likely sell through anyway) — same weighting as the original module.
    if (daysToExpiry <= 60 && stockPct > 15)
        return "soon";
    if (daysToExpiry <= 21)
        return "soon";
    return "ok";
}
async function sweepExpiryRisk() {
    const snap = await admin_1.db.collection("inventory").get();
    const now = Date.now();
    const batch = admin_1.db.batch();
    const flagged = [];
    snap.forEach((doc) => {
        const item = doc.data();
        const daysToExpiry = Math.round((item.expiryDate - now) / MS_PER_DAY);
        const expiry = riskLevel(daysToExpiry, item.stockPct);
        batch.update(doc.ref, { expiry, updatedAt: now });
        if (expiry !== "ok") {
            flagged.push({ id: doc.id, name: item.name, facilityId: item.facilityId, daysToExpiry });
        }
    });
    await batch.commit();
    return flagged;
}
/** Runs once a day so every inventory doc's `expiry` field stays current
 *  without the client having to compute it from a raw date. */
exports.expiryRiskDailySweep = (0, scheduler_1.onSchedule)("every day 03:00", async () => {
    const flagged = await sweepExpiryRisk();
    console.log(`Expiry sweep flagged ${flagged.length} items`, flagged);
});
/** Callable version so the officer/pharmacist dashboard can trigger an
 *  on-demand re-check instead of waiting for the nightly run. */
exports.runExpiryRiskCheck = (0, https_1.onCall)(async () => {
    const flagged = await sweepExpiryRisk();
    return { flaggedCount: flagged.length, flagged };
});
