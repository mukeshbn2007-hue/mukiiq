"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { FileAudio, UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils"

const MAX_BYTES = 100 * 1024 * 1024 // 100MB
const ACCEPTED = [".mp3", ".wav"]

function isAccepted(file: File) {
  const name = file.name.toLowerCase()
  return ACCEPTED.some((ext) => name.endsWith(ext))
}

export function UploadZone({
  onFile,
  disabled,
}: {
  onFile: (file: File) => void
  disabled?: boolean
}) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateAndSend = (file: File | undefined) => {
    setError(null)
    if (!file) return
    if (!isAccepted(file)) {
      setError("Unsupported format. Please upload an MP3 or WAV file.")
      return
    }
    if (file.size > MAX_BYTES) {
      setError("File is too large. The maximum size is 100MB.")
      return
    }
    onFile(file)
  }

  return (
    <div>
      <motion.button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (disabled) return
          validateAndSend(e.dataTransfer.files?.[0])
        }}
        whileHover={disabled ? undefined : { scale: 1.005 }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-card px-6 py-16 text-center transition-colors",
          !disabled && "cursor-pointer hover:border-primary/60 hover:bg-card/80",
          dragging && "border-primary bg-primary/5",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span
          className={cn(
            "flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform",
            dragging && "scale-110",
          )}
        >
          {dragging ? (
            <FileAudio className="size-7" />
          ) : (
            <UploadCloud className="size-7" />
          )}
        </span>
        <div>
          <p className="text-lg font-medium">
            {dragging ? "Drop to upload" : "Drag & drop your track"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            or click to browse — MP3 or WAV, up to 100MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="audio/mpeg,audio/wav,.mp3,.wav"
          className="hidden"
          onChange={(e) => validateAndSend(e.target.files?.[0])}
        />
      </motion.button>

      {error && (
        <p className="mt-3 text-center text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
