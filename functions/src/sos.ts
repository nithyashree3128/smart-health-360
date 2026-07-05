import { onCall, HttpsError } from "firebase-functions/v2/https"
import { onDocumentCreated } from "firebase-functions/v2/firestore"
import { db } from "./admin"

const AMBULANCE_FLEET = ["TN-38-AZ-4412", "TN-38-AZ-4419", "TN-38-BC-2201"]

export const requestSos = onCall(async (request) => {
  if (request.auth?.token.role !== "patient") {
    throw new HttpsError("permission-denied", "Only patients can trigger SOS.")
  }
  const { lat, lng } = request.data as { lat: number; lng: number }
  const ref = await db.collection("sosEvents").add({
    patientUid: request.auth.uid,
    lat,
    lng,
    status: "requested",
    ambulanceId: null,
    etaMinutes: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
  return { id: ref.id }
})

/**
 * Simulates dispatch progression server-side (instead of the frontend's
 * setTimeout-based fake steps) so the status is real, shared, and visible
 * to doctor/officer dashboards watching sosEvents, not just the requesting
 * patient's screen.
 */
export const onSosCreated = onDocumentCreated("sosEvents/{id}", async (event) => {
  const ref = event.data?.ref
  if (!ref) return

  await new Promise((r) => setTimeout(r, 1500))
  await ref.update({ status: "dispatched", updatedAt: Date.now() })

  const ambulanceId = AMBULANCE_FLEET[Math.floor(Math.random() * AMBULANCE_FLEET.length)]
  const etaMinutes = 4 + Math.floor(Math.random() * 6)
  await new Promise((r) => setTimeout(r, 1500))
  await ref.update({ status: "en_route", ambulanceId, etaMinutes, updatedAt: Date.now() })
})
