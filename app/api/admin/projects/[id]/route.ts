import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { projectFormSchema } from "@/lib/schemas"
import {
  getProjectById,
  updateProject,
  deleteProject,
} from "@/lib/services/projectService"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const project = await getProjectById(id)
    if (!project)
      return NextResponse.json({ error: "Not found" }, { status: 404 })

    return NextResponse.json(project)
  } catch (error) {
    console.error("[GET /api/admin/projects/[id]]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const parsed = projectFormSchema.partial().safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { id } = await params
    const updated = await updateProject(id, parsed.data)
    return NextResponse.json(updated)
  } catch (error) {
    console.error("[PUT /api/admin/projects/[id]]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    await deleteProject(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE /api/admin/projects/[id]]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
