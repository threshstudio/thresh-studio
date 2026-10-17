import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { sendNewsletterSchema } from "@/lib/schemas"
import { broadcastNewsletter } from "@/lib/services/newsletterService"
import { sendNewsletterBroadcastEmail } from "@/lib/email"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = sendNewsletterSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid payload" },
        { status: 400 }
      )
    }

    const {
      subject,
      previewText,
      contentHtml,
      contentJson,
      testEmailOnly,
      testEmail,
    } = parsed.data

    // If Test Email Only: Send directly to the specified test address
    if (testEmailOnly) {
      const recipient = testEmail || session.user?.email
      if (!recipient) {
        return NextResponse.json(
          { error: "No recipient specified for test email." },
          { status: 400 }
        )
      }

      await sendNewsletterBroadcastEmail({
        to: recipient,
        subject: `[TEST] ${subject}`,
        previewText,
        contentHtml,
      })

      return NextResponse.json({
        success: true,
        message: `Test email sent successfully to ${recipient}`,
      })
    }

    // Full Broadcast to all active subscribers
    const result = await broadcastNewsletter({
      subject,
      previewText,
      contentHtml,
      contentJson,
      sentBy: session.user?.email || "Admin",
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("[POST /api/admin/newsletter/send]", error)
    return NextResponse.json(
      { error: "Failed to broadcast newsletter. Please try again." },
      { status: 500 }
    )
  }
}
