import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getNewsletterCampaigns } from "@/lib/services/newsletterService"

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const campaigns = await getNewsletterCampaigns()
    return NextResponse.json(campaigns)
  } catch (error) {
    console.error("[GET /api/admin/newsletter/campaigns]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
