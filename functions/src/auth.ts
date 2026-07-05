import * as functionsV1 from "firebase-functions/v1"
import { getAuth } from "firebase-admin/auth"
import { db } from "./admin"
import type { Role } from "../../lib/firebase.ts/schema"

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
export const onUserCreate = functionsV1.auth.user().onCreate(async (user) => {
  const role: Role = "patient"

  await getAuth().setCustomUserClaims(user.uid, { role })

  await db.doc(`users/${user.uid}`).set({
    uid: user.uid,
    role,
    name: user.displayName ?? "Unnamed Patient",
    phone: user.phoneNumber ?? "",
    facilityId: null,
    regionId: null,
    createdAt: Date.now(),
  })
})
