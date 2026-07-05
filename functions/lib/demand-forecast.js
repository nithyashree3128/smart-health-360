"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forecastDemand = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin_1 = require("./admin");
function movingAverage(values, window) {
    const slice = values.slice(-window);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
}
function weekdaySeasonalFactor(entries) {
    const byWeekday = {};
    for (const e of entries) {
        const wd = new Date(e.date).getDay();
        (byWeekday[wd] ?? (byWeekday[wd] = [])).push(e.unitsUsed);
    }
    const overallAvg = entries.reduce((a, e) => a + e.unitsUsed, 0) / (entries.length || 1);
    const factors = {};
    for (let wd = 0; wd < 7; wd++) {
        const vals = byWeekday[wd];
        factors[wd] = vals?.length && overallAvg > 0
            ? vals.reduce((a, b) => a + b, 0) / vals.length / overallAvg
            : 1;
    }
    return factors;
}
exports.forecastDemand = (0, https_1.onCall)(async (request) => {
    const { facilityId, sku, horizonDays = 7 } = request.data;
    if (!facilityId || !sku) {
        throw new https_1.HttpsError("invalid-argument", "facilityId and sku are required.");
    }
    const snap = await admin_1.db
        .collection(`demandHistory/${facilityId}_${sku}/entries`)
        .orderBy("date")
        .get();
    const entries = snap.docs.map((d) => d.data());
    if (entries.length < 7) {
        throw new https_1.HttpsError("failed-precondition", "Need at least 7 days of history to forecast.");
    }
    const recentValues = entries.map((e) => e.unitsUsed);
    const baseline = movingAverage(recentValues, 14);
    const seasonal = weekdaySeasonalFactor(entries);
    const today = new Date();
    const forecast = Array.from({ length: horizonDays }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() + i + 1);
        const wd = d.getDay();
        const predictedUnits = Math.round(baseline * (seasonal[wd] ?? 1));
        return { date: d.toISOString().slice(0, 10), predictedUnits };
    });
    return {
        facilityId,
        sku,
        baselineDailyAverage: Math.round(baseline * 10) / 10,
        forecast,
    };
});
