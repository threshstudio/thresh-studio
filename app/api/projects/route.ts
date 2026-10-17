import { NextResponse } from "next/server"
import { getProjects } from "@/lib/services/projectService"

export async function GET() {
  try {
    // Only fetch published projects for the public API
    const projects = await getProjects({ publishedOnly: true })
    return NextResponse.json(projects)
  } catch (error) {
    console.error("[GET /api/projects]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
