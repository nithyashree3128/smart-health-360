"use client"

import { useEffect, useState } from "react"
import { collection, query, onSnapshot, type QueryConstraint } from "firebase/firestore"
import { db } from "@/lib/firebase.ts/client"

/**
 * Subscribes to a Firestore collection in real time.
 *
 * This is the one hook every dashboard should use in place of importing
 * arrays from lib/mock-data.ts. Example, replacing the patient dashboard's
 * bed finder:
 *
 *   const { data: beds, loading } = useCollection<BedDoc>("beds")
 *
 * Scope with query constraints (e.g. beds for one facility only):
 *
 *   useCollection<BedDoc>("beds", [where("facilityId", "==", facilityId)])
 */
export function useCollection<T>(path: string, constraints: QueryConstraint[] = []) {
  const [data, setData] = useState<(T & { id: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    const q = query(collection(db, path), ...constraints)
    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) })))
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      },
    )
    return () => unsub()
    // constraints array is rebuilt each render by callers — stringify to
    // avoid re-subscribing on every render if callers pass inline arrays.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, JSON.stringify(constraints.map((c) => c.type))])

  return { data, loading, error }
}
