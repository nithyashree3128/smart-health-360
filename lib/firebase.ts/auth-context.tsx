"use client"

import { createContext, useContext, useEffect, useState } from "react"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth"
import { doc, onSnapshot } from "firebase/firestore"
import { auth, db } from "@/lib/firebase.ts/client"
import type { Role, UserDoc } from "@/lib/firebase.ts/schema"

type AuthState = {
  user: User | null
  profile: UserDoc | null
  role: Role | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserDoc | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (!u) {
        setProfile(null)
        setRole(null)
        setLoading(false)
        return
      }
      // Custom claim is the source of truth for security rules; force a
      // token refresh so a just-assigned role claim (set by the
      // onUserCreate Cloud Function) shows up without a re-login.
      const token = await u.getIdTokenResult(true)
      setRole((token.claims.role as Role) ?? null)
    })
    return () => unsubAuth()
  }, [])

  useEffect(() => {
    if (!user) return
    // Live profile doc — role UI badges, facility assignment, etc.
    const unsubDoc = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setProfile(snap.exists() ? (snap.data() as UserDoc) : null)
      setLoading(false)
    })
    return () => unsubDoc()
  }, [user])

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function signUp(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password)
    // Role assignment + users/{uid} doc creation happens server-side in the
    // onUserCreate Cloud Function (functions/src/auth.ts) — never trust the
    // client to set its own role.
  }

  async function signOut() {
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
