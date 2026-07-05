import { onCall, HttpsError } from "firebase-functions/v2/https"
import { getAuth } from "firebase-admin/auth"
import { db } from "./admin"
import type { Role } from "../../lib/firebase.ts/schema"

/**
 * Officers use this to grant doctor/pharmacist/officer access to an
 * existing account (found by email) — the real implementation behind the
 * login screen's "pre-authorized Organizational Whitelist credentials"
 * copy. Only an existing officer can call it, so the very first officer
 * account has to be granted manually once via the Firebase console
 * (Authentication > user > or a one-off admin script) — document this in
 * your setup notes so it's not a surprise.
 */
export const provisionStaffAccount = onCall(async (request) => {
  if (request.auth?.token.role !== "officer") {
    throw new HttpsError("permission-denied", "Only an officer can provision staff accounts.")
  }
  const { email, role, facilityId, name } = request.data as {
    email: string
    role: Role
    facilityId: string
    name: string
  }
  if (!["doctor", "pharmacist", "officer"].includes(role)) {
    throw new HttpsError("invalid-argument", "role must be doctor, pharmacist, or officer.")
  }

  const targetUser = await getAuth().getUserByEmail(email)
  await getAuth().setCustomUserClaims(targetUser.uid, { role })
  await db.doc(`users/${targetUser.uid}`).set(
    { role, facilityId, name, uid: targetUser.uid },
    { merge: true },
  )

  return { uid: targetUser.uid, role }
})
