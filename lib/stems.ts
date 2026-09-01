export type StemType =
  | "vocals"
  | "drums"
  | "bass"
  | "guitar"
  | "piano"
  | "other"

export type Stem = {
  type: StemType
  file_url: string
}

export type GenerationStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"

export type Generation = {
  id: string
  filename: string
  createdAt: string
  durationLabel: string
  status: GenerationStatus
  stems: Stem[]
}

export const STEM_META: Record<
  StemType,
  { label: string; color: string; description: string }
> = {
  vocals: {
    label: "Vocals",
    color: "#00dc82",
    description: "Lead & backing voice",
  },
  drums: {
    label: "Drums",
    color: "#ff5c7c",
    description: "Kick, snare & percussion",
  },
  bass: {
    label: "Bass",
    color: "#5c8cff",
    description: "Bassline & low end",
  },
  guitar: {
    label: "Guitar",
    color: "#a78bfa",
    description: "Guitar & strings",
  },
  piano: {
    label: "Piano",
    color: "#f472b6",
    description: "Piano & keys",
  },
  other: {
    label: "Other",
    color: "#f5b74a",
    description: "Other instruments",
  },
}

export const STEM_ORDER: StemType[] = [
  "vocals",
  "drums",
  "bass",
  "guitar",
  "piano",
  "other",
]

// Public-domain / freely usable sample audio used by the existing history UI.
const SAMPLE_AUDIO = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
]

export function buildStems(): Stem[] {
  return STEM_ORDER.map((type, i) => ({
    type,
    file_url: SAMPLE_AUDIO[i % SAMPLE_AUDIO.length],
  }))
}

export const SAMPLE_GENERATIONS: Generation[] = [
  {
    id: "gen_a1",
    filename: "midnight-drive.mp3",
    createdAt: "2026-08-28T14:32:00Z",
    durationLabel: "3:42",
    status: "completed",
    stems: buildStems(),
  },
  {
    id: "gen_a2",
    filename: "sunset-boulevard.wav",
    createdAt: "2026-08-27T09:14:00Z",
    durationLabel: "4:05",
    status: "completed",
    stems: buildStems(),
  },
  {
    id: "gen_a3",
    filename: "neon-heartbeat.mp3",
    createdAt: "2026-08-25T21:48:00Z",
    durationLabel: "2:58",
    status: "completed",
    stems: buildStems(),
  },
  {
    id: "gen_a4",
    filename: "coastline-demo.wav",
    createdAt: "2026-08-24T11:03:00Z",
    durationLabel: "3:20",
    status: "completed",
    stems: buildStems(),
  },
  {
    id: "gen_a5",
    filename: "afterglow-take3.mp3",
    createdAt: "2026-08-22T16:27:00Z",
    durationLabel: "5:11",
    status: "completed",
    stems: buildStems(),
  },
  {
    id: "gen_a6",
    filename: "paper-planes.mp3",
    createdAt: "2026-08-21T08:52:00Z",
    durationLabel: "3:33",
    status: "completed",
    stems: buildStems(),
  },
  {
    id: "gen_a7",
    filename: "glass-city.wav",
    createdAt: "2026-08-19T19:41:00Z",
    durationLabel: "4:47",
    status: "completed",
    stems: buildStems(),
  },
  {
    id: "gen_a8",
    filename: "lo-fi-study.mp3",
    createdAt: "2026-08-18T13:09:00Z",
    durationLabel: "2:44",
    status: "completed",
    stems: buildStems(),
  },
  {
    id: "gen_a9",
    filename: "thunder-road.mp3",
    createdAt: "2026-08-16T10:22:00Z",
    durationLabel: "3:56",
    status: "completed",
    stems: buildStems(),
  },
  {
    id: "gen_a10",
    filename: "velvet-morning.wav",
    createdAt: "2026-08-15T07:38:00Z",
    durationLabel: "4:19",
    status: "completed",
    stems: buildStems(),
  },
  {
    id: "gen_a11",
    filename: "electric-avenue.mp3",
    createdAt: "2026-08-13T22:05:00Z",
    durationLabel: "3:12",
    status: "completed",
    stems: buildStems(),
  },
  {
    id: "gen_a12",
    filename: "first-light.mp3",
    createdAt: "2026-08-11T15:50:00Z",
    durationLabel: "3:29",
    status: "completed",
    stems: buildStems(),
  },
]

export const DAILY_LIMIT = 5

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}