import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { subscribersQuerySchema } from "@/lib/schemas"
import {
  getSubscribers,
  getSubscriberStats,
} from "@/lib/services/newsletterService"

export async function GET(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const rawParams = {
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
    }

    const parsed = subscribersQuerySchema.safeParse(rawParams)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message || "Invalid query parameters",
        },
        { status: 400 }
      )
    }

    const { search, status, page, limit } = parsed.data

    const [subscribersData, stats] = await Promise.all([
      getSubscribers({
        search,
        status: status === "all" ? undefined : status,
        page,
        limit,
      }),
      getSubscriberStats(),
    ])

    return NextResponse.json({ ...subscribersData, stats })
  } catch (error) {
    console.error("[GET /api/admin/newsletter/subscribers]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
