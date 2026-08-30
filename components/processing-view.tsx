"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Waveform } from "@/components/waveform"

const STAGES = [
  "Analyzing frequency spectrum",
  "Isolating vocals",
  "Extracting drums & percussion",
  "Separating bass & instruments",
  "Rendering stems",
]

export function ProcessingView({ filename }: { filename: string }) {
  const [progress, setProgress] = useState(4)

  useEffect(() => {
    // Approach ~95% over the ~5s mock window; the parent flips to results.
    const start = Date.now()
    const id = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min(95, 4 + (elapsed / 5000) * 91)
      setProgress(pct)
    }, 80)
    return () => clearInterval(id)
  }, [])

  const stageIndex = Math.min(
    STAGES.length - 1,
    Math.floor((progress / 100) * STAGES.length),
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-6 sm:p-10"
    >
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <div className="h-16 w-full max-w-xs">
          <Waveform bars={40} animate />
        </div>

        <h2 className="mt-6 text-xl font-semibold">Separating stems…</h2>
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {filename}
        </p>

        <div className="mt-8 w-full">
          <Progress value={progress} className="h-2" />
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{STAGES[stageIndex]}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
