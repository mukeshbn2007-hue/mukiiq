"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import {
  Download,
  Headphones,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Waveform } from "@/components/waveform"
import { STEM_META, STEM_ORDER, type Generation, type StemType } from "@/lib/stems"
import { cn } from "@/lib/utils"

type TrackState = {
  volume: number
  muted: boolean
  solo: boolean
}

const initialTrack: TrackState = {
  volume: 0.8,
  muted: false,
  solo: false,
}

export function StemPlayer({ generation }: { generation: Generation }) {
  const [playing, setPlaying] = useState(false)

  const [tracks, setTracks] = useState<Record<StemType, TrackState>>(() =>
    Object.fromEntries(
      STEM_ORDER.map((type) => [type, { ...initialTrack }]),
    ) as Record<StemType, TrackState>,
  )

  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({})

  const stemByType = useMemo(() => {
    const map = {} as Record<StemType, string>

    for (const stem of generation.stems) {
      map[stem.type] = stem.file_url
    }

    return map
  }, [generation])

  const anySolo = STEM_ORDER.some((type) => tracks[type]?.solo)

  useEffect(() => {
    for (const type of STEM_ORDER) {
      const el = audioRefs.current[type]
      if (!el) continue

      const track = tracks[type]

      if (!track) {
        el.volume = 0
        continue
      }

      const audible = anySolo ? track.solo : !track.muted
      el.volume = audible ? track.volume : 0
    }
  }, [tracks, anySolo])

  const togglePlay = () => {
    const next = !playing
    setPlaying(next)

    for (const type of STEM_ORDER) {
      const el = audioRefs.current[type]
      if (!el) continue

      if (next) {
        void el.play().catch(() => {})
      } else {
        el.pause()
      }
    }
  }

  const updateTrack = (
    type: StemType,
    patch: Partial<TrackState>,
  ) => {
    setTracks((previous) => ({
      ...previous,
      [type]: {
        ...previous[type],
        ...patch,
      },
    }))
  }

  const downloadStem = (type: StemType) => {
    const url = stemByType[type]

    if (!url) return

    const link = document.createElement("a")
    link.href = url
    link.download = `${generation.filename.replace(/\.[^.]+$/, "")}-${type}.wav`
    link.rel = "noopener"
    link.target = "_blank"

    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const downloadAll = () => {
    for (const type of STEM_ORDER) {
      if (stemByType[type]) {
        downloadStem(type)
      }
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            onClick={togglePlay}
            className="size-12 rounded-full"
            aria-label={playing ? "Pause all stems" : "Play all stems"}
          >
            {playing ? (
              <Pause className="size-5" />
            ) : (
              <Play className="size-5 translate-x-0.5" />
            )}
          </Button>

          <div>
            <p className="font-medium">{generation.filename}</p>

            <p className="text-xs text-muted-foreground">
              {generation.durationLabel} • {generation.stems.length} stems
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={downloadAll}
          className="border-border bg-transparent hover:bg-secondary"
        >
          <Download className="size-4" />
          Download All
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {STEM_ORDER.map((type) => {
          const meta = STEM_META[type]
          const track = tracks[type]
          const url = stemByType[type]

          if (!track || !url) return null

          const dimmed = anySolo && !track.solo

          return (
            <motion.div
              key={type}
              layout
              className={cn(
                "flex flex-col gap-3 rounded-xl border border-border bg-background/60 p-4 transition-opacity sm:flex-row sm:items-center",
                dimmed && "opacity-40",
              )}
            >
              <div className="flex flex-1 items-center gap-3">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: meta.color }}
                />

                <div className="w-16 shrink-0">
                  <p className="text-sm font-medium leading-none">
                    {meta.label}
                  </p>
                </div>

                <div className="h-8 min-w-0 flex-1">
                  <Waveform
                    bars={56}
                    color={meta.color}
                    animate={
                      playing &&
                      !dimmed &&
                      !(track.muted && !anySolo)
                    }
                    seed={type.charCodeAt(0)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    updateTrack(type, {
                      muted: !track.muted,
                    })
                  }
                  className={cn(
                    "size-8 text-muted-foreground hover:text-foreground",
                    track.muted &&
                      "text-destructive hover:text-destructive",
                  )}
                  aria-label={
                    track.muted
                      ? `Unmute ${meta.label}`
                      : `Mute ${meta.label}`
                  }
                  aria-pressed={track.muted}
                >
                  {track.muted ? (
                    <VolumeX className="size-4" />
                  ) : (
                    <Volume2 className="size-4" />
                  )}
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    updateTrack(type, {
                      solo: !track.solo,
                    })
                  }
                  className={cn(
                    "size-8 text-muted-foreground hover:text-foreground",
                    track.solo &&
                      "bg-primary/15 text-primary hover:text-primary",
                  )}
                  aria-label={
                    track.solo
                      ? `Unsolo ${meta.label}`
                      : `Solo ${meta.label}`
                  }
                  aria-pressed={track.solo}
                >
                  <Headphones className="size-4" />
                </Button>

                <Slider
                  value={[Math.round(track.volume * 100)]}
                  max={100}
                  step={1}
                  onValueChange={([value]) =>
                    updateTrack(type, {
                      volume: value / 100,
                    })
                  }
                  className="w-24"
                  aria-label={`${meta.label} volume`}
                />

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => downloadStem(type)}
                  className="size-8 text-muted-foreground hover:text-foreground"
                  aria-label={`Download ${meta.label} stem`}
                >
                  <Download className="size-4" />
                </Button>
              </div>

              <audio
                ref={(element) => {
                  audioRefs.current[type] = element
                }}
                src={url}
                preload="none"
                loop
              />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}