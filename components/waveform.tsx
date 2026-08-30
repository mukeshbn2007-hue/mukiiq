"use client"

import { motion } from "framer-motion"

type WaveformProps = {
  bars?: number
  className?: string
  color?: string
  animate?: boolean
  seed?: number
}

// Deterministic pseudo-random so SSR and client match.
function heightFor(i: number, seed: number) {
  const v = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453
  const frac = v - Math.floor(v)
  return 20 + frac * 80
}

export function Waveform({
  bars = 48,
  className,
  color = "var(--primary)",
  animate = true,
  seed = 1,
}: WaveformProps) {
  return (
    <div
      className={className}
      style={{ display: "flex", alignItems: "center", gap: 3, height: "100%" }}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => {
        const base = heightFor(i, seed)
        return (
          <motion.span
            key={i}
            style={{
              flex: 1,
              minWidth: 2,
              borderRadius: 999,
              background: color,
              display: "block",
            }}
            initial={{ height: `${base * 0.4}%` }}
            animate={
              animate
                ? {
                    height: [`${base * 0.4}%`, `${base}%`, `${base * 0.5}%`],
                  }
                : { height: `${base}%` }
            }
            transition={
              animate
                ? {
                    duration: 0.9 + (i % 5) * 0.15,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                    delay: (i % 7) * 0.05,
                  }
                : undefined
            }
          />
        )
      })}
    </div>
  )
}
