"use client"

import { motion } from "framer-motion"

interface WaveformProps {
  seed?: number
  bars?: number
  color?: string
  className?: string
}

function seededRandom(seed: number) {
  let value = seed

  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function generateHeights(seed: number, bars: number) {
  const random = seededRandom(seed)

  return Array.from({ length: bars }, () => {
    return Math.floor(random() * 70) + 20
  })
}

export function Waveform({
  seed = 1,
  bars = 40,
  color = "#00dc82",
  className,
}: WaveformProps) {
  const heights = generateHeights(seed, bars)

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        height: "100%",
        width: "100%",
      }}
      aria-hidden="true"
    >
      {heights.map((height, i) => (
        <motion.span
          key={`${seed}-${i}`}
          initial={{ height: `${height}%` }}
          animate={{ height: `${height}%` }}
          transition={{
            duration: 0.4,
            delay: i * 0.01,
          }}
          style={{
            flex: 1,
            minWidth: 2,
            borderRadius: 999,
            background: color,
            display: "block",
          }}
        />
      ))}
    </div>
  )
}