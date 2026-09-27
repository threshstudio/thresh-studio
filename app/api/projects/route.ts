import { NextResponse } from "next/server"
import { getProjects } from "@/lib/services/projectService"

export async function GET() {
  try {
    // Only fetch published projects for the public API
    const projects = await getProjects({ publishedOnly: true })
    return NextResponse.json(projects)
  } catch (error) {
    console.error("[PUBLIC_PROJECTS_GET]", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
