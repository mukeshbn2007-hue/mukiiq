import { NextResponse } from "next/server"
import { buildStems } from "@/lib/stems"

/**
 * Mock status endpoint the client polls after upload.
 *
 * Real implementation would look up the job by id, verify it belongs
 * to the signed-in user, and return the true status. Here we always
 * report a completed separation with sample stems.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  return NextResponse.json({
    generationId: id,
    status: "completed",
    stems: buildStems(),
  })
}
