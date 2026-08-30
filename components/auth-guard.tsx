"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { AudioWaveform, Loader2, Lock } from "lucide-react"
import { useAuth } from "@/lib/mock-auth"
import { Button } from "@/components/ui/button"

/**
 * Client-side gate. With real Clerk you'd enforce this in middleware
 * and redirect to Clerk's hosted sign-in; here we render an inline
 * sign-in prompt so the preview works without keys.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, signIn } = useAuth()

  // Mimic redirect-to-sign-in intent for observability.
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // In production Clerk: router.push(`/sign-in?redirect_url=${path}`)
    }
  }, [isLoaded, isSignedIn])

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center"
        >
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Lock className="size-6" />
          </span>
          <h1 className="mt-5 text-xl font-semibold">Sign in to continue</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The Studio is available to signed-in members. Sign in to upload
            tracks and separate stems.
          </p>
          <Button onClick={() => signIn()} className="mt-6 w-full" size="lg">
            <AudioWaveform className="size-4" />
            Sign in to StemSplit
          </Button>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}
