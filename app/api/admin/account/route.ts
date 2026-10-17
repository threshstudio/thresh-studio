import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { updateEmailSchema, updatePasswordSchema } from "@/lib/schemas"
import {
  requestEmailChange,
  changeAdminPassword,
} from "@/lib/services/accountService"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    if (body.type === "email") {
      const parsed = updateEmailSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid data", details: parsed.error.format() },
          { status: 400 }
        )
      }

      const result = await requestEmailChange({
        userId: session.user.id,
        userEmail: session.user.email,
        newEmail: parsed.data.email,
      })

      return NextResponse.json(result)
    } else if (body.type === "password") {
      const parsed = updatePasswordSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid data", details: parsed.error.format() },
          { status: 400 }
        )
      }

      const { currentPassword, newPassword } = parsed.data

      try {
        await changeAdminPassword({
          userId: session.user.id,
          userEmail: session.user.email,
          currentPassword,
          newPassword,
        })
        return NextResponse.json({ success: true })
      } catch (err: unknown) {
        const error = err as Error
        if (error.message === "INCORRECT_PASSWORD") {
          return NextResponse.json(
            { error: "Incorrect current password" },
            { status: 400 }
          )
        }
        if (error.message === "PASSWORD_NOT_SET") {
          return NextResponse.json(
            { error: "Password not set" },
            { status: 400 }
          )
        }
        throw err
      }
    } else {
      return NextResponse.json(
        { error: "Invalid update type" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("[PATCH /api/admin/account]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
