import { NextResponse } from "next/server"
import { buildStems } from "@/lib/stems"

/**
 * Mock "download all as ZIP" endpoint.
 *
 * Real implementation would verify ownership, zip the user's stem
 * files, and stream the archive (or redirect to a signed URL). Here
 * we return the list of stem URLs as JSON so the flow is exercised.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  return NextResponse.json({
    generationId: id,
    archive: `/downloads/${id}/stems.zip`,
    stems: buildStems(),
    note: "Mock endpoint — wire this to a real zip stream or signed URL.",
  })
}
