"use client"

/**
 * Clerk-ready mock auth.
 *
 * This mirrors a subset of Clerk's client API (`useAuth`, sign-in/out,
 * a `UserButton`-style menu). When you're ready for real Clerk:
 *   1. Wrap the app in <ClerkProvider> instead of <MockAuthProvider>.
 *   2. Replace `useAuth` imports with `@clerk/nextjs`.
 *   3. Swap <UserButton /> here for Clerk's <UserButton />.
 *   4. Enforce auth in middleware + /api routes with `auth()`.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

export type MockUser = {
  id: string
  fullName: string
  email: string
  initials: string
}

type AuthState = {
  isLoaded: boolean
  isSignedIn: boolean
  user: MockUser | null
  signIn: () => void
  signOut: () => void
}

const STORAGE_KEY = "mukiiq.mock-user"

const DEMO_USER: MockUser = {
  id: "user_mock_123",
  fullName: "Alex Rivera",
  email: "alex@mukiiq.io",
  initials: "AR",
}

const AuthContext = createContext<AuthState | null>(null)

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [user, setUser] = useState<MockUser | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setUser(JSON.parse(raw))
    } catch {
      // ignore
    }
    setIsLoaded(true)
  }, [])

  const signIn = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER))
    setUser(DEMO_USER)
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const value = useMemo<AuthState>(
    () => ({
      isLoaded,
      isSignedIn: Boolean(user),
      user,
      signIn,
      signOut,
    }),
    [isLoaded, user, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within MockAuthProvider")
  return ctx
}
