"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provisionStaffAccount = void 0;
const https_1 = require("firebase-functions/v2/https");
const auth_1 = require("firebase-admin/auth");
const admin_1 = require("./admin");
/**
 * Officers use this to grant doctor/pharmacist/officer access to an
 * existing account (found by email) — the real implementation behind the
 * login screen's "pre-authorized Organizational Whitelist credentials"
 * copy. Only an existing officer can call it, so the very first officer
 * account has to be granted manually once via the Firebase console
 * (Authentication > user > or a one-off admin script) — document this in
 * your setup notes so it's not a surprise.
 */
exports.provisionStaffAccount = (0, https_1.onCall)(async (request) => {
    if (request.auth?.token.role !== "officer") {
        throw new https_1.HttpsError("permission-denied", "Only an officer can provision staff accounts.");
    }
    const { email, role, facilityId, name } = request.data;
    if (!["doctor", "pharmacist", "officer"].includes(role)) {
        throw new https_1.HttpsError("invalid-argument", "role must be doctor, pharmacist, or officer.");
    }
    const targetUser = await (0, auth_1.getAuth)().getUserByEmail(email);
    await (0, auth_1.getAuth)().setCustomUserClaims(targetUser.uid, { role });
    await admin_1.db.doc(`users/${targetUser.uid}`).set({ role, facilityId, name, uid: targetUser.uid }, { merge: true });
    return { uid: targetUser.uid, role };
});
