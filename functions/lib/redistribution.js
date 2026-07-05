"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeRedistribution = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin_1 = require("./admin");
/** Great-circle distance in km — identical formula to the Python version. */
function haversineKm(a, b) {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
}
const SURPLUS_THRESHOLD = 70; // stockPct above this = candidate donor
const DEFICIT_THRESHOLD = 20; // stockPct below this = candidate recipient
/**
 * Greedy nearest-match redistribution proposer.
 *
 * For every SKU with both a surplus-side and deficit-side facility, pairs
 * the deficit facility with its nearest surplus facility carrying that SKU,
 * proposes a transfer, and writes it to redistributionContracts for an
 * officer to approve/reject. Same greedy-nearest-neighbor approach as the
 * original Python prototype — ported here so it runs server-side against
 * live Firestore data instead of a static mock array.
 *
 * Confidence is a simple heuristic: closer + larger stock gap = higher
 * confidence. Swap in a real model later without changing the contract
 * shape or the officer-approval flow.
 */
exports.computeRedistribution = (0, https_1.onCall)(async (request) => {
    if (request.auth?.token.role !== "officer" && request.auth?.token.role !== "pharmacist") {
        throw new https_1.HttpsError("permission-denied", "Only pharmacist or officer roles can run the matcher.");
    }
    const [invSnap, facSnap] = await Promise.all([
        admin_1.db.collection("inventory").get(),
        admin_1.db.collection("facilities").get(),
    ]);
    const facilities = new Map();
    facSnap.forEach((d) => facilities.set(d.id, { id: d.id, ...d.data() }));
    const inventory = invSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const bySku = new Map();
    for (const item of inventory) {
        if (!bySku.has(item.sku))
            bySku.set(item.sku, []);
        bySku.get(item.sku).push(item);
    }
    const proposals = [];
    for (const [, rows] of bySku) {
        const deficits = rows.filter((r) => r.stockPct < DEFICIT_THRESHOLD);
        const surplusPool = rows.filter((r) => r.stockPct > SURPLUS_THRESHOLD);
        if (!deficits.length || !surplusPool.length)
            continue;
        // Greedy: for each deficit facility (largest gap first), take the
        // nearest still-available surplus facility.
        const remainingSurplus = [...surplusPool];
        deficits.sort((a, b) => a.stockPct - b.stockPct);
        for (const deficit of deficits) {
            const deficitFacility = facilities.get(deficit.facilityId);
            if (!deficitFacility || !remainingSurplus.length)
                continue;
            let nearest = null;
            let nearestDist = Infinity;
            for (const s of remainingSurplus) {
                const sf = facilities.get(s.facilityId);
                if (!sf)
                    continue;
                const dist = haversineKm(deficitFacility, sf);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearest = s;
                }
            }
            if (!nearest)
                continue;
            const transferUnits = Math.min(Math.round(nearest.units * 0.3), // don't fully drain the donor
            Math.max(20, Math.round((DEFICIT_THRESHOLD - deficit.stockPct) * 5)));
            const confidence = Math.max(0.5, Math.min(0.97, 1 - nearestDist / 200 + (SURPLUS_THRESHOLD - deficit.stockPct) / 400));
            const contract = {
                itemSku: deficit.sku,
                itemName: deficit.name,
                surplusFacilityId: nearest.facilityId,
                deficitFacilityId: deficit.facilityId,
                units: transferUnits,
                distanceKm: Math.round(nearestDist * 10) / 10,
                confidence: Math.round(confidence * 100) / 100,
                status: "proposed",
                createdAt: Date.now(),
                decidedAt: null,
                decidedBy: null,
            };
            const ref = await admin_1.db.collection("redistributionContracts").add(contract);
            proposals.push({ id: ref.id, ...contract });
            // remove exhausted donor from pool for this pass
            remainingSurplus.splice(remainingSurplus.indexOf(nearest), 1);
        }
    }
    return { proposals, count: proposals.length };
});
