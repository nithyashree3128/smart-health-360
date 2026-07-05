"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUserCreate = void 0;
const functionsV1 = __importStar(require("firebase-functions/v1"));
const auth_1 = require("firebase-admin/auth");
const admin_1 = require("./admin");
/**
 * Fires when a new account is created via any Firebase Auth method
 * (email/password now; phone OTP once you enable it in the console).
 *
 * Every new signup defaults to role "patient" — the only self-serve role,
 * matching the login screen's "Public/Patients can self-register" copy.
 * Staff accounts (doctor/pharmacist/officer) must be provisioned by an
 * officer via the `provisionStaffAccount` callable below, which is the
 * server-side equivalent of the "Organizational Whitelist" the UI promises.
 */
exports.onUserCreate = functionsV1.auth.user().onCreate(async (user) => {
    const role = "patient";
    await (0, auth_1.getAuth)().setCustomUserClaims(user.uid, { role });
    await admin_1.db.doc(`users/${user.uid}`).set({
        uid: user.uid,
        role,
        name: user.displayName ?? "Unnamed Patient",
        phone: user.phoneNumber ?? "",
        facilityId: null,
        regionId: null,
        createdAt: Date.now(),
    });
});
