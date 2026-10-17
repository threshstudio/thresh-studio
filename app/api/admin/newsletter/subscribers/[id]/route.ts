import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { deleteSubscriber } from "@/lib/services/newsletterService"

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    await deleteSubscriber(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE /api/admin/newsletter/subscribers/[id]]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
