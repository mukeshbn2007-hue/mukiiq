"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, Info, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UploadZone } from "@/components/upload-zone"
import { ProcessingView } from "@/components/processing-view"
import { StemPlayer } from "@/components/stem-player"
import { DAILY_LIMIT, type Generation, type StemType } from "@/lib/stems"

type Phase = "idle" | "processing" | "done"

const ML_SERVICE_URL = "http://127.0.0.1:8000"

const STEM_TYPES: StemType[] = [
  "vocals",
  "drums",
  "bass",
  "guitar",
  "piano",
  "other",
]

export default function DashboardPage() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [filename, setFilename] = useState("")
  const [generation, setGeneration] = useState<Generation | null>(null)
  const [used, setUsed] = useState(0)
  const [limitError, setLimitError] = useState<string | null>(null)

  const remaining = Math.max(0, DAILY_LIMIT - used)

  const handleFile = async (file: File) => {
    setLimitError(null)

    if (remaining <= 0) {
      setLimitError(
        "You've reached today's free-tier limit. Try again tomorrow.",
      )
      return
    }

    setFilename(file.name)
    setPhase("processing")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${ML_SERVICE_URL}/separate`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        let message = "AI separation failed."

        try {
          const errorData = await response.json()

          if (errorData?.detail) {
            message = String(errorData.detail)
          }
        } catch {
          // Keep the default error message.
        }

        throw new Error(message)
      }

      const data = await response.json()

      if (
        data.status !== "completed" ||
        !data.stems ||
        typeof data.stems !== "object"
      ) {
        throw new Error("The AI service returned an invalid response.")
      }

      const stems = STEM_TYPES
        .filter((type) => data.stems[type])
        .map((type) => ({
          type,
          file_url: `${ML_SERVICE_URL}${data.stems[type]}`,
        }))

      if (stems.length !== STEM_TYPES.length) {
        throw new Error(
          "The AI service did not return all six stems.",
        )
      }

      const newGeneration: Generation = {
        id: data.job_id,
        filename: data.filename ?? file.name,
        createdAt: new Date().toISOString(),
        durationLabel: "AI processed",
        status: "completed",
        stems,
      }

      setGeneration(newGeneration)
      setUsed((count) => count + 1)
      setPhase("done")
    } catch (error) {
      console.error("MUKIIQ separation error:", error)

      setPhase("idle")

      setLimitError(
        error instanceof Error
          ? error.message
          : "Unable to connect to the MUKIIQ AI service.",
      )
    }
  }

  const reset = () => {
    setPhase("idle")
    setGeneration(null)
    setFilename("")
    setLimitError(null)
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Studio
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Upload a track to separate it into six AI-powered stems.
          </p>
        </div>

        {phase === "done" && (
          <Button
            variant="outline"
            onClick={reset}
            className="border-border bg-transparent hover:bg-secondary"
          >
            <RotateCcw className="size-4" />
            New separation
          </Button>
        )}
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <Info className="size-4 shrink-0 text-primary" />

        <p className="text-sm text-muted-foreground">
          Free tier: {DAILY_LIMIT} generations/day. You have{" "}
          <span className="font-semibold text-foreground">
            {remaining}
          </span>{" "}
          left today.
        </p>
      </div>

      {limitError && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3">
          <AlertCircle className="size-4 shrink-0 text-destructive" />

          <p className="text-sm text-destructive">
            {limitError}
          </p>
        </div>
      )}

      <div className="mt-6">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <UploadZone
                onFile={handleFile}
                disabled={remaining <= 0}
              />
            </motion.div>
          )}

          {phase === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ProcessingView filename={filename} />
            </motion.div>
          )}

          {phase === "done" && generation && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StemPlayer generation={generation} />

              <p className="mt-4 text-center text-sm text-muted-foreground">
                Your separations are saved to{" "}
                <Link
                  href="/app/history"
                  className="font-medium text-primary hover:underline"
                >
                  History
                </Link>
                .
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}