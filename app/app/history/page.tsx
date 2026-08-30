"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Music4, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StemPlayer } from "@/components/stem-player"
import { Waveform } from "@/components/waveform"
import {
  SAMPLE_GENERATIONS,
  STEM_META,
  STEM_ORDER,
  formatDate,
} from "@/lib/stems"
import { cn } from "@/lib/utils"

export default function HistoryPage() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            History
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {SAMPLE_GENERATIONS.length} separations — tap any track to open the
            player.
          </p>
        </div>
        <Button render={<Link href="/app" />}>
          <Plus className="size-4" />
          New separation
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {SAMPLE_GENERATIONS.map((gen, i) => {
          const open = openId === gen.id
          return (
            <motion.div
              key={gen.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.4) }}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <button
                onClick={() => setOpenId(open ? null : gen.id)}
                className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-secondary/50 sm:px-5"
                aria-expanded={open}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Music4 className="size-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{gen.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(gen.createdAt)} • {gen.durationLabel}
                  </p>
                </div>

                {/* Mini stem legend */}
                <div className="hidden items-center gap-3 md:flex">
                  {STEM_ORDER.map((type) => (
                    <span
                      key={type}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                      <span
                        className="size-2 rounded-full"
                        style={{ background: STEM_META[type].color }}
                      />
                      {STEM_META[type].label}
                    </span>
                  ))}
                </div>

                <div className="hidden h-7 w-28 shrink-0 lg:block">
                  <Waveform
                    bars={28}
                    animate={false}
                    color="var(--muted-foreground)"
                    seed={i + 1}
                  />
                </div>

                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-muted-foreground transition-transform",
                    open && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="border-t border-border p-4 sm:p-5">
                      <StemPlayer generation={gen} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
