import { NextResponse } from "next/server"

const MAX_BYTES = 100 * 1024 * 1024 // 100MB
const ACCEPTED_EXT = [".mp3", ".wav"]

/**
 * Mock upload endpoint.
 *
 * Real implementation would:
 *   1. Verify the Clerk session with `auth()`.
 *   2. Check the user's daily quota in the database.
 *   3. Store the uploaded file (e.g. Vercel Blob) and enqueue a
 *      separation job, returning a generation id to poll.
 */
export async function POST(request: Request) {
  const form = await request.formData()
  const filename = String(form.get("filename") ?? "")
  const size = Number(form.get("size") ?? 0)

  if (!filename) {
    return NextResponse.json({ error: "Missing filename." }, { status: 400 })
  }

  const lower = filename.toLowerCase()
  if (!ACCEPTED_EXT.some((ext) => lower.endsWith(ext))) {
    return NextResponse.json(
      { error: "Unsupported format. Upload an MP3 or WAV file." },
      { status: 415 },
    )
  }

  if (size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 100MB." },
      { status: 413 },
    )
  }

  const generationId = `gen_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`

  return NextResponse.json({
    generationId,
    status: "processing",
    estimatedSeconds: 5,
  })
}
